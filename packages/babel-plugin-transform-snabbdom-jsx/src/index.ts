import syntaxJsx from '@babel/plugin-syntax-jsx'
import htmlTags from 'html-tags'
import svgTags from 'svg-tags'

const needSpread = 'needSpread'

const rootAttributes = ['id', 'className', 'style', 'key', 'ref']
const prefixes = ['props', 'on', 'hook', 'attrs']

/*** helper ***/

/**
 * Add attribute to an attributes object
 * @param t
 * @param attributes Object<[type: string]: ObjectExpression>
 * @param type string
 * @param value ObjectProperty | SpreadElement
 */
const addAttribute = (t, attributes, type, value) => {
    if (attributes[type]) {
        let exists = false
        if (t.isObjectProperty(value) && (type === 'on')) {
            attributes[type].properties.forEach(property => {
                if (t.isObjectProperty(property) && property.key.value === value.key.value) {
                    if (t.isArrayExpression(property.value)) {
                        property.value.elements.push(value.value)
                    } else {
                        property.value = t.arrayExpression([property.value, value.value])
                    }
                    exists = true
                }
            })
        }
        if (!exists) {
            attributes[type].properties.push(value)
        }
    } else {
        attributes[type] = t.objectExpression([value])
    }
}

/*** transform ***/

/**
 * Transform JSXMemberExpression to MemberExpression
 * @param t
 * @param path JSXMemberExpression
 * @returns MemberExpression
 */
const transformJSXMemberExpression = (t, path) => {
    const objectPath = path.get('object')
    const propertyPath = path.get('property')
    const transformedObject = objectPath.isJSXMemberExpression()
        ? transformJSXMemberExpression(t, objectPath)
        : t.identifier(objectPath.get('name').node)
    const transformedProperty = t.identifier(propertyPath.get('name').node)
    return t.memberExpression(transformedObject, transformedProperty)
}

/**
 * Transform JSXText to StringLiteral
 * @param t
 * @param path JSXText
 * @returns StringLiteral
 */
const transformJSXText = (t, path) => {
    const node = path.node
    const lines = node.value.split(/\r\n|\n|\r/)

    let lastNonEmptyLine = 0

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/[^ \t]/)) {
            lastNonEmptyLine = i
        }
    }

    let str = ''

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        const isFirstLine = i === 0
        const isLastLine = i === lines.length - 1
        const isLastNonEmptyLine = i === lastNonEmptyLine

        // replace rendered whitespace tabs with spaces
        let trimmedLine = line.replace(/\t/g, ' ')

        // trim whitespace touching a newline
        if (!isFirstLine) {
            trimmedLine = trimmedLine.replace(/^[ ]+/, '')
        }

        // trim whitespace touching an endline
        if (!isLastLine) {
            trimmedLine = trimmedLine.replace(/[ ]+$/, '')
        }

        if (trimmedLine) {
            if (!isLastNonEmptyLine) {
                trimmedLine += ' '
            }

            str += trimmedLine
        }
    }

    return str !== '' ? t.stringLiteral(str) : null
}

/**
 * Transform JSXExpressionContainer to Expression
 * @param t
 * @param path JSXExpressionContainer
 * @returns Expression
 */
const transformJSXExpressionContainer = (t, path) => path.get('expression').node

/**
 * Transform JSXSpreadChild
 * @param t
 * @param path JSXSpreadChild
 * @returns SpreadElement
 */
const transformJSXSpreadChild = (t, path) => t.spreadElement(path.get('expression').node)

/**
 * Transform attributes to ObjectExpression
 * @param t
 * @param attributes Object<[type: string]: ObjectExpression>
 * @returns ObjectExpression
 */
const transformAttributes = (t, attributes) =>
    t.objectExpression(
        Object.entries(attributes).map(
            ([key, value]) => t.objectProperty(t.stringLiteral(key), value),
        ),
    )

/*** parser ***/

/**
* Parse vue attribute from JSXAttribute
* @param t
* @param path JSXAttribute
* @param attributes Object<[type: string]: ObjectExpression>
* @param attributesArray Array<Object<[type: string]: ObjectExpression>>
* @returns Attributes
*/
const parseAttributeJSXSpreadAttribute = (t, path, attributes, attributesArray) => {
    const argument = path.get('argument')
    if (
        t.isObjectExpression(argument) &&
        !argument.get('properties').find(el => !t.isObjectProperty(el) || !prefixes.includes(el.get('key.name').node))
    ) {
        argument.get('properties').forEach(propertyPath => {
            addAttribute(t, attributes, propertyPath.get('key.name').node, t.spreadElement(propertyPath.get('value').node))
        })
    } else {
        attributesArray.push(attributes)
        attributesArray.push({ type: needSpread, argument: argument.node })
        attributes = {}
    }
    return attributes
}

/**
 * Parse vue attribute from JSXAttribute
 * @param t
 * @param path JSXAttribute
 * @param attributes Object<[type: string]: ObjectExpression>
 * @param tagName string
 * @param elementType string
 * @returns Array<Expression>
 */
const parseAttributeJSXAttribute = (t, path, attributes) => {
    const namePath = path.get('name')
    let prefix
    let name
    if (t.isJSXNamespacedName(namePath)) {
        name = `${namePath.get('namespace.name').node}:${namePath.get('name.name').node}`
    } else {
        name = namePath.get('name').node
    }
    if (prefixes.includes(name) && t.isJSXExpressionContainer(path.get('value'))) {
        return t.JSXSpreadAttribute(t.objectExpression([t.objectProperty(t.stringLiteral(name), path.get('value').node.expression)]))
    }

    prefix = prefixes.find(el => name.startsWith(el)) || 'attrs'
    name = name.replace(new RegExp(`^${prefix}\-?`), '')
    name = name[0].toLowerCase() + name.substr(1)

    const valuePath = path.get('value')
    let value
    if (!valuePath.node) {
        value = t.booleanLiteral(true)
    } else if (t.isStringLiteral(valuePath)) {
        value = valuePath.node
    } else {
        /* istanbul ignore else */
        if (t.isJSXExpressionContainer(valuePath)) {
            value = valuePath.get('expression').node
        } else {
            throw new Error(`getAttributes (attribute value): ${valuePath.type} is not supported`)
        }
    }

    if (rootAttributes.includes(name)) {
        attributes[name] = value
    } else {
        addAttribute(t, attributes, prefix, t.objectProperty(t.stringLiteral(name), value))
    }
}

/*** getter ***/

/**
 * Get tag (first attribute for h) from JSXOpeningElement
 * @param t
 * @param path JSXOpeningElement
 * @returns Identifier | StringLiteral | MemberExpression
 */
const getTag = (t, path) => {
    const namePath = path.get('name')
    if (t.isJSXIdentifier(namePath)) {
        const name = namePath.get('name').node
        if (path.scope.hasBinding(name) && !htmlTags.includes(name) && !svgTags.includes(name)) {
            return t.identifier(name)
        } else {
            return t.stringLiteral(name)
        }
    }

    /* istanbul ignore else */
    if (t.isJSXMemberExpression(namePath)) {
        return transformJSXMemberExpression(t, namePath)
    }
    /* istanbul ignore next */
    throw new Error(`getTag: ${namePath.type} is not supported`)
}

/**
 * Get children from Array of JSX children
 * @param t
 * @param paths Array<JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement>
 * @returns Array<Expression | SpreadElement>
 */
const getChildren = (t, paths, hExpr) =>
    paths
        .map(path => {
            if (path.isJSXText()) {
                return transformJSXText(t, path)
            }
            if (path.isJSXExpressionContainer()) {
                return transformJSXExpressionContainer(t, path)
            }
            if (path.isJSXSpreadChild()) {
                return transformJSXSpreadChild(t, path)
            }
            /* istanbul ignore else */
            if (path.isJSXElement()) {
                return transformJSXElement(t, path, hExpr)
            }
            /* istanbul ignore next */
            throw new Error(`getChildren: ${path.type} is not supported`)
        })
        .filter(el => el !== null && !t.isJSXEmptyExpression(el))

/**
* Get attributes from Array of JSX attributes
* @param t
* @param paths Array<JSXAttribute | JSXSpreadAttribute>
* @param tag Identifier | StringLiteral | MemberExpression
* @param openingElementPath JSXOpeningElement
* @returns Array<Expression>
*/
/**
 * Get attributes from Array of JSX attributes
 * @param t
 * @param paths Array<JSXAttribute | JSXSpreadAttribute>
 * @param tag Identifier | StringLiteral | MemberExpression
 * @param openingElementPath JSXOpeningElement
 * @returns Array<Expression>
 */
const getAttributes = (t, paths, tag, openingElementPath) => {
    const attributesArray = []
    let attributes = {}

    paths.forEach(path => {
        if (t.isJSXAttribute(path)) {
            const possibleSpreadNode = parseAttributeJSXAttribute(t, path, attributes)
            if (possibleSpreadNode) {
                openingElementPath.node.attributes.push(possibleSpreadNode)
                const attributePaths = openingElementPath.get('attributes')
                const lastAttributePath = attributePaths[attributePaths.length - 1]
                attributes = parseAttributeJSXSpreadAttribute(t, lastAttributePath, attributes, attributesArray)
                lastAttributePath.remove()
            }
            return
        }
        /* istanbul ignore else */
        if (t.isJSXSpreadAttribute(path)) {
            attributes = parseAttributeJSXSpreadAttribute(t, path, attributes, attributesArray)
            return
        }
        /* istanbul ignore next */
        throw new Error(`getAttributes (attribute): ${path.type} is not supported`)
    })

    if (attributesArray.length > 0) {
        if (Object.keys(attributes).length > 0) {
            attributesArray.push(attributes)
        }
        return t.arrayExpression(
            attributesArray.map(el => {
                if (el.type === needSpread) {
                    return el.argument
                } else {
                    return transformAttributes(t, el)
                }
            }),
        )
    }
    return Object.entries(attributes).length && transformAttributes(t, attributes)
}

/*** main ***/

/**
 * Transform JSXElement to h() calls
 * @param t
 * @param path JSXElement
 * @returns CallExpression
 */
const transformJSXElement = (t, path, hExpr) => {
    const openingElementPath = path.get('openingElement')
    const tag = getTag(t, openingElementPath)
    const children = getChildren(t, path.get('children'), hExpr)
    const attributes = getAttributes(t, openingElementPath.get('attributes'), tag, openingElementPath)

    const args = [tag]
    if (attributes) {
        args.push(attributes)
    }
    if (children.length) {
        args.push(t.arrayExpression(children))
    }

    return t.callExpression(hExpr, args)
}

export default ({ types: t }) => {

    return {
        name: 'babel-plugin-transform-vue-jsx',
        inherits: syntaxJsx,
        visitor: {
            JSXElement(path) {
                // TODO: Configurable
                const hExpr = t.memberExpression(t.identifier("GhostV"), t.identifier("createElement"))

                path.replaceWith(transformJSXElement(t, path, hExpr))
            },
        },
    }
}

/*** jsx doc ***/
/**
 * JSXElement
 *     openingElement: JSXOpeningElement | <div>
 *         children                      |     <!-- ... -->
 *     closingElement: JSXClosingElement | </div>
 *
 * JSXOpeningElement
 *     name: JSXIdentifier            | <div
 *         attributes: []JSXAttribute |     id="app"
 *                                    | >
 */
