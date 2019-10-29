export type Key = string | number
export type JSXElementConstructor<P> = (props: P) => GhostVElement | null
export interface GhostVElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
  type: T;
  props: P;
  key: Key | null;
}

export type GhostVText = string | number;
export type GhostVChild = GhostVElement | GhostVText;
export interface GhostVNodeArray extends Array<GhostVNode> { }
export type GhostVFragment = {} | GhostVNodeArray;
export interface GhostVPortal extends GhostVElement {
  key: Key | null;
  children: GhostVNode;
}
export type GhostVNode = GhostVChild | GhostVFragment | GhostVPortal | boolean | null | undefined;

export type PropsWithChildren<P> = P & { children?: GhostVNode };
export type Component<P> = FunctionComponent<P>
export interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): GhostVElement | null;
  //propTypes?: WeakValidationMap<P>;
  //contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}

export interface Attributes {
  key?: Key;
}

//import {
//  Key,
//  JSXElementConstructor,
//  GhostVElement,
//  GhostVText,
//  GhostVChild,
//  GhostVNodeArray,
//  GhostVFragment,
//  GhostVPortal,
//  GhostVNode,
//  PropsWithChildren,
//  Component,
//  FunctionComponent,
//  Attributes,
//} from './define'
