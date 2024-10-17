// ../../../../../srv/web/resources/node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t4, e6, o5) {
    if (this._$cssResult$ = true, o5 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4, this.t = e6;
  }
  get styleSheet() {
    let t4 = this.o;
    const s5 = this.t;
    if (e && void 0 === t4) {
      const e6 = void 0 !== s5 && 1 === s5.length;
      e6 && (t4 = o.get(s5)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && o.set(s5, t4));
    }
    return t4;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
var S = (s5, o5) => {
  if (e) s5.adoptedStyleSheets = o5.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
  else for (const e6 of o5) {
    const o6 = document.createElement("style"), n4 = t.litNonce;
    void 0 !== n4 && o6.setAttribute("nonce", n4), o6.textContent = e6.cssText, s5.appendChild(o6);
  }
};
var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e6 = "";
  for (const s5 of t5.cssRules) e6 += s5.cssText;
  return r(e6);
})(t4) : t4;

// ../../../../../srv/web/resources/node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t4, s5) => t4;
var u = { toAttribute(t4, s5) {
  switch (s5) {
    case Boolean:
      t4 = t4 ? l : null;
      break;
    case Object:
    case Array:
      t4 = null == t4 ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, s5) {
  let i6 = t4;
  switch (s5) {
    case Boolean:
      i6 = null !== t4;
      break;
    case Number:
      i6 = null === t4 ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        i6 = JSON.parse(t4);
      } catch (t5) {
        i6 = null;
      }
  }
  return i6;
} };
var f = (t4, s5) => !i2(t4, s5);
var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
  static addInitializer(t4) {
    this._$Ei(), (this.l ??= []).push(t4);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t4, s5 = y) {
    if (s5.state && (s5.attribute = false), this._$Ei(), this.elementProperties.set(t4, s5), !s5.noAccessor) {
      const i6 = Symbol(), r6 = this.getPropertyDescriptor(t4, i6, s5);
      void 0 !== r6 && e2(this.prototype, t4, r6);
    }
  }
  static getPropertyDescriptor(t4, s5, i6) {
    const { get: e6, set: h4 } = r2(this.prototype, t4) ?? { get() {
      return this[s5];
    }, set(t5) {
      this[s5] = t5;
    } };
    return { get() {
      return e6?.call(this);
    }, set(s6) {
      const r6 = e6?.call(this);
      h4.call(this, s6), this.requestUpdate(t4, r6, i6);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t4 = n2(this);
    t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t5 = this.properties, s5 = [...h(t5), ...o2(t5)];
      for (const i6 of s5) this.createProperty(i6, t5[i6]);
    }
    const t4 = this[Symbol.metadata];
    if (null !== t4) {
      const s5 = litPropertyMetadata.get(t4);
      if (void 0 !== s5) for (const [t5, i6] of s5) this.elementProperties.set(t5, i6);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t5, s5] of this.elementProperties) {
      const i6 = this._$Eu(t5, s5);
      void 0 !== i6 && this._$Eh.set(i6, t5);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s5) {
    const i6 = [];
    if (Array.isArray(s5)) {
      const e6 = new Set(s5.flat(1 / 0).reverse());
      for (const s6 of e6) i6.unshift(c(s6));
    } else void 0 !== s5 && i6.push(c(s5));
    return i6;
  }
  static _$Eu(t4, s5) {
    const i6 = s5.attribute;
    return false === i6 ? void 0 : "string" == typeof i6 ? i6 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
  }
  addController(t4) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
  }
  removeController(t4) {
    this._$EO?.delete(t4);
  }
  _$E_() {
    const t4 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
    for (const i6 of s5.keys()) this.hasOwnProperty(i6) && (t4.set(i6, this[i6]), delete this[i6]);
    t4.size > 0 && (this._$Ep = t4);
  }
  createRenderRoot() {
    const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t4, this.constructor.elementStyles), t4;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t4) => t4.hostDisconnected?.());
  }
  attributeChangedCallback(t4, s5, i6) {
    this._$AK(t4, i6);
  }
  _$EC(t4, s5) {
    const i6 = this.constructor.elementProperties.get(t4), e6 = this.constructor._$Eu(t4, i6);
    if (void 0 !== e6 && true === i6.reflect) {
      const r6 = (void 0 !== i6.converter?.toAttribute ? i6.converter : u).toAttribute(s5, i6.type);
      this._$Em = t4, null == r6 ? this.removeAttribute(e6) : this.setAttribute(e6, r6), this._$Em = null;
    }
  }
  _$AK(t4, s5) {
    const i6 = this.constructor, e6 = i6._$Eh.get(t4);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t5 = i6.getPropertyOptions(e6), r6 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
      this._$Em = e6, this[e6] = r6.fromAttribute(s5, t5.type), this._$Em = null;
    }
  }
  requestUpdate(t4, s5, i6) {
    if (void 0 !== t4) {
      if (i6 ??= this.constructor.getPropertyOptions(t4), !(i6.hasChanged ?? f)(this[t4], s5)) return;
      this.P(t4, s5, i6);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t4, s5, i6) {
    this._$AL.has(t4) || this._$AL.set(t4, s5), true === i6.reflect && this._$Em !== t4 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t4);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.scheduleUpdate();
    return null != t4 && await t4, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t6, s6] of this._$Ep) this[t6] = s6;
        this._$Ep = void 0;
      }
      const t5 = this.constructor.elementProperties;
      if (t5.size > 0) for (const [s6, i6] of t5) true !== i6.wrapped || this._$AL.has(s6) || void 0 === this[s6] || this.P(s6, this[s6], i6);
    }
    let t4 = false;
    const s5 = this._$AL;
    try {
      t4 = this.shouldUpdate(s5), t4 ? (this.willUpdate(s5), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s5)) : this._$EU();
    } catch (s6) {
      throw t4 = false, this._$EU(), s6;
    }
    t4 && this._$AE(s5);
  }
  willUpdate(t4) {
  }
  _$AE(t4) {
    this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    this._$Ej &&= this._$Ej.forEach((t5) => this._$EC(t5, this[t5])), this._$EU();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.4");

// ../../../../../srv/web/resources/node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var e3 = "$lit$";
var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
var a2 = Array.isArray;
var u2 = (t4) => a2(t4) || "function" == typeof t4?.[Symbol.iterator];
var d2 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y2 = (t4) => (i6, ...s5) => ({ _$litType$: t4, strings: i6, values: s5 });
var x = y2(1);
var b2 = y2(2);
var w = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var E = r3.createTreeWalker(r3, 129);
function C(t4, i6) {
  if (!Array.isArray(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i6) : i6;
}
var P = (t4, i6) => {
  const s5 = t4.length - 1, o5 = [];
  let r6, l3 = 2 === i6 ? "<svg>" : "", c4 = f2;
  for (let i7 = 0; i7 < s5; i7++) {
    const s6 = t4[i7];
    let a3, u3, d3 = -1, y3 = 0;
    for (; y3 < s6.length && (c4.lastIndex = y3, u3 = c4.exec(s6), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r6 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r6 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r6 = void 0);
    const x2 = c4 === m && t4[i7 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === f2 ? s6 + n3 : d3 >= 0 ? (o5.push(a3), s6.slice(0, d3) + e3 + s6.slice(d3) + h2 + x2) : s6 + h2 + (-2 === d3 ? i7 : x2);
  }
  return [C(t4, l3 + (t4[s5] || "<?>") + (2 === i6 ? "</svg>" : "")), o5];
};
var V = class _V {
  constructor({ strings: t4, _$litType$: s5 }, n4) {
    let r6;
    this.parts = [];
    let c4 = 0, a3 = 0;
    const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = P(t4, s5);
    if (this.el = _V.createElement(f3, n4), E.currentNode = this.el.content, 2 === s5) {
      const t5 = this.el.content.firstChild;
      t5.replaceWith(...t5.childNodes);
    }
    for (; null !== (r6 = E.nextNode()) && d3.length < u3; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes()) for (const t5 of r6.getAttributeNames()) if (t5.endsWith(e3)) {
          const i6 = v2[a3++], s6 = r6.getAttribute(t5).split(h2), e6 = /([.?@])?(.*)/.exec(i6);
          d3.push({ type: 1, index: c4, name: e6[2], strings: s6, ctor: "." === e6[1] ? k : "?" === e6[1] ? H : "@" === e6[1] ? I : R }), r6.removeAttribute(t5);
        } else t5.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r6.removeAttribute(t5));
        if ($.test(r6.tagName)) {
          const t5 = r6.textContent.split(h2), s6 = t5.length - 1;
          if (s6 > 0) {
            r6.textContent = i3 ? i3.emptyScript : "";
            for (let i6 = 0; i6 < s6; i6++) r6.append(t5[i6], l2()), E.nextNode(), d3.push({ type: 2, index: ++c4 });
            r6.append(t5[s6], l2());
          }
        }
      } else if (8 === r6.nodeType) if (r6.data === o3) d3.push({ type: 2, index: c4 });
      else {
        let t5 = -1;
        for (; -1 !== (t5 = r6.data.indexOf(h2, t5 + 1)); ) d3.push({ type: 7, index: c4 }), t5 += h2.length - 1;
      }
      c4++;
    }
  }
  static createElement(t4, i6) {
    const s5 = r3.createElement("template");
    return s5.innerHTML = t4, s5;
  }
};
function N(t4, i6, s5 = t4, e6) {
  if (i6 === w) return i6;
  let h4 = void 0 !== e6 ? s5._$Co?.[e6] : s5._$Cl;
  const o5 = c3(i6) ? void 0 : i6._$litDirective$;
  return h4?.constructor !== o5 && (h4?._$AO?.(false), void 0 === o5 ? h4 = void 0 : (h4 = new o5(t4), h4._$AT(t4, s5, e6)), void 0 !== e6 ? (s5._$Co ??= [])[e6] = h4 : s5._$Cl = h4), void 0 !== h4 && (i6 = N(t4, h4._$AS(t4, i6.values), h4, e6)), i6;
}
var S2 = class {
  constructor(t4, i6) {
    this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i6;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t4) {
    const { el: { content: i6 }, parts: s5 } = this._$AD, e6 = (t4?.creationScope ?? r3).importNode(i6, true);
    E.currentNode = e6;
    let h4 = E.nextNode(), o5 = 0, n4 = 0, l3 = s5[0];
    for (; void 0 !== l3; ) {
      if (o5 === l3.index) {
        let i7;
        2 === l3.type ? i7 = new M(h4, h4.nextSibling, this, t4) : 1 === l3.type ? i7 = new l3.ctor(h4, l3.name, l3.strings, this, t4) : 6 === l3.type && (i7 = new L(h4, this, t4)), this._$AV.push(i7), l3 = s5[++n4];
      }
      o5 !== l3?.index && (h4 = E.nextNode(), o5++);
    }
    return E.currentNode = r3, e6;
  }
  p(t4) {
    let i6 = 0;
    for (const s5 of this._$AV) void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t4, s5, i6), i6 += s5.strings.length - 2) : s5._$AI(t4[i6])), i6++;
  }
};
var M = class _M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t4, i6, s5, e6) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t4, this._$AB = i6, this._$AM = s5, this.options = e6, this._$Cv = e6?.isConnected ?? true;
  }
  get parentNode() {
    let t4 = this._$AA.parentNode;
    const i6 = this._$AM;
    return void 0 !== i6 && 11 === t4?.nodeType && (t4 = i6.parentNode), t4;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t4, i6 = this) {
    t4 = N(this, t4, i6), c3(t4) ? t4 === T || null == t4 || "" === t4 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t4 !== this._$AH && t4 !== w && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : u2(t4) ? this.k(t4) : this._(t4);
  }
  S(t4) {
    return this._$AA.parentNode.insertBefore(t4, this._$AB);
  }
  T(t4) {
    this._$AH !== t4 && (this._$AR(), this._$AH = this.S(t4));
  }
  _(t4) {
    this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(r3.createTextNode(t4)), this._$AH = t4;
  }
  $(t4) {
    const { values: i6, _$litType$: s5 } = t4, e6 = "number" == typeof s5 ? this._$AC(t4) : (void 0 === s5.el && (s5.el = V.createElement(C(s5.h, s5.h[0]), this.options)), s5);
    if (this._$AH?._$AD === e6) this._$AH.p(i6);
    else {
      const t5 = new S2(e6, this), s6 = t5.u(this.options);
      t5.p(i6), this.T(s6), this._$AH = t5;
    }
  }
  _$AC(t4) {
    let i6 = A.get(t4.strings);
    return void 0 === i6 && A.set(t4.strings, i6 = new V(t4)), i6;
  }
  k(t4) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i6 = this._$AH;
    let s5, e6 = 0;
    for (const h4 of t4) e6 === i6.length ? i6.push(s5 = new _M(this.S(l2()), this.S(l2()), this, this.options)) : s5 = i6[e6], s5._$AI(h4), e6++;
    e6 < i6.length && (this._$AR(s5 && s5._$AB.nextSibling, e6), i6.length = e6);
  }
  _$AR(t4 = this._$AA.nextSibling, i6) {
    for (this._$AP?.(false, true, i6); t4 && t4 !== this._$AB; ) {
      const i7 = t4.nextSibling;
      t4.remove(), t4 = i7;
    }
  }
  setConnected(t4) {
    void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
  }
};
var R = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t4, i6, s5, e6, h4) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t4, this.name = i6, this._$AM = e6, this.options = h4, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = T;
  }
  _$AI(t4, i6 = this, s5, e6) {
    const h4 = this.strings;
    let o5 = false;
    if (void 0 === h4) t4 = N(this, t4, i6, 0), o5 = !c3(t4) || t4 !== this._$AH && t4 !== w, o5 && (this._$AH = t4);
    else {
      const e7 = t4;
      let n4, r6;
      for (t4 = h4[0], n4 = 0; n4 < h4.length - 1; n4++) r6 = N(this, e7[s5 + n4], i6, n4), r6 === w && (r6 = this._$AH[n4]), o5 ||= !c3(r6) || r6 !== this._$AH[n4], r6 === T ? t4 = T : t4 !== T && (t4 += (r6 ?? "") + h4[n4 + 1]), this._$AH[n4] = r6;
    }
    o5 && !e6 && this.j(t4);
  }
  j(t4) {
    t4 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t4) {
    this.element[this.name] = t4 === T ? void 0 : t4;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t4) {
    this.element.toggleAttribute(this.name, !!t4 && t4 !== T);
  }
};
var I = class extends R {
  constructor(t4, i6, s5, e6, h4) {
    super(t4, i6, s5, e6, h4), this.type = 5;
  }
  _$AI(t4, i6 = this) {
    if ((t4 = N(this, t4, i6, 0) ?? T) === w) return;
    const s5 = this._$AH, e6 = t4 === T && s5 !== T || t4.capture !== s5.capture || t4.once !== s5.once || t4.passive !== s5.passive, h4 = t4 !== T && (s5 === T || e6);
    e6 && this.element.removeEventListener(this.name, this, s5), h4 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
  }
  handleEvent(t4) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
  }
};
var L = class {
  constructor(t4, i6, s5) {
    this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4) {
    N(this, t4);
  }
};
var Z = t2.litHtmlPolyfillSupport;
Z?.(V, M), (t2.litHtmlVersions ??= []).push("3.1.3");
var j = (t4, i6, s5) => {
  const e6 = s5?.renderBefore ?? i6;
  let h4 = e6._$litPart$;
  if (void 0 === h4) {
    const t5 = s5?.renderBefore ?? null;
    e6._$litPart$ = h4 = new M(i6.insertBefore(l2(), t5), t5, void 0, s5 ?? {});
  }
  return h4._$AI(t4), h4;
};

// ../../../../../srv/web/resources/node_modules/lit-element/lit-element.js
var s3 = class extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t4 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t4.firstChild, t4;
  }
  update(t4) {
    const i6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = j(i6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return w;
  }
};
s3._$litElement$ = true, s3["finalized", "finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: s3 });
var r4 = globalThis.litElementPolyfillSupport;
r4?.({ LitElement: s3 });
(globalThis.litElementVersions ??= []).push("4.0.5");

// ../../../../../srv/web/resources/node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e4 = (t4) => (...e6) => ({ _$litDirective$: t4, values: e6 });
var i4 = class {
  constructor(t4) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t4, e6, i6) {
    this._$Ct = t4, this._$AM = e6, this._$Ci = i6;
  }
  _$AS(t4, e6) {
    return this.update(t4, e6);
  }
  update(t4, e6) {
    return this.render(...e6);
  }
};

// ../../../../../srv/web/resources/node_modules/lit-html/directives/unsafe-html.js
var e5 = class extends i4 {
  constructor(i6) {
    if (super(i6), this.it = T, i6.type !== t3.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r6) {
    if (r6 === T || null == r6) return this._t = void 0, this.it = r6;
    if (r6 === w) return r6;
    if ("string" != typeof r6) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r6 === this.it) return this._t;
    this.it = r6;
    const s5 = [r6];
    return s5.raw = s5, this._t = { _$litType$: this.constructor.resultType, strings: s5, values: [] };
  }
};
e5.directiveName = "unsafeHTML", e5.resultType = 1;
var o4 = e4(e5);

// ../../../../../srv/web/resources/node_modules/@lit/task/task.js
var i5 = Symbol();
var h3 = class {
  get taskComplete() {
    return this.t || (1 === this.status ? this.t = new Promise((t4, s5) => {
      this.i = t4, this.o = s5;
    }) : 3 === this.status ? this.t = Promise.reject(this.h) : this.t = Promise.resolve(this.l)), this.t;
  }
  constructor(t4, s5, i6) {
    this.u = 0, this.status = 0, (this.p = t4).addController(this);
    const h4 = "object" == typeof s5 ? s5 : { task: s5, args: i6 };
    this._ = h4.task, this.v = h4.args, this.j = h4.argsEqual ?? r5, this.m = h4.onComplete, this.g = h4.onError, this.autoRun = h4.autoRun ?? true, "initialValue" in h4 && (this.l = h4.initialValue, this.status = 2, this.k = this.A?.());
  }
  hostUpdate() {
    true === this.autoRun && this.O();
  }
  hostUpdated() {
    "afterUpdate" === this.autoRun && this.O();
  }
  A() {
    if (void 0 === this.v) return;
    const t4 = this.v();
    if (!Array.isArray(t4)) throw Error("The args function must return an array");
    return t4;
  }
  async O() {
    const t4 = this.A(), s5 = this.k;
    this.k = t4, t4 === s5 || void 0 === t4 || void 0 !== s5 && this.j(s5, t4) || await this.run(t4);
  }
  async run(t4) {
    let s5, h4;
    t4 ??= this.A(), this.k = t4, 1 === this.status ? this.T?.abort() : (this.t = void 0, this.i = void 0, this.o = void 0), this.status = 1, "afterUpdate" === this.autoRun ? queueMicrotask(() => this.p.requestUpdate()) : this.p.requestUpdate();
    const r6 = ++this.u;
    this.T = new AbortController();
    let e6 = false;
    try {
      s5 = await this._(t4, { signal: this.T.signal });
    } catch (t5) {
      e6 = true, h4 = t5;
    }
    if (this.u === r6) {
      if (s5 === i5) this.status = 0;
      else {
        if (false === e6) {
          try {
            this.m?.(s5);
          } catch {
          }
          this.status = 2, this.i?.(s5);
        } else {
          try {
            this.g?.(h4);
          } catch {
          }
          this.status = 3, this.o?.(h4);
        }
        this.l = s5, this.h = h4;
      }
      this.p.requestUpdate();
    }
  }
  abort(t4) {
    1 === this.status && this.T?.abort(t4);
  }
  get value() {
    return this.l;
  }
  get error() {
    return this.h;
  }
  render(t4) {
    switch (this.status) {
      case 0:
        return t4.initial?.();
      case 1:
        return t4.pending?.();
      case 2:
        return t4.complete?.(this.value);
      case 3:
        return t4.error?.(this.error);
      default:
        throw Error("Unexpected status: " + this.status);
    }
  }
};
var r5 = (s5, i6) => s5 === i6 || s5.length === i6.length && s5.every((s6, h4) => !f(s6, i6[h4]));

// ../../../../../srv/web/resources/custom-elements/prod/lit-posts/lit-posts.js
var LitPosts = class extends s3 {
  static properties = {
    // public
    type: { type: String, reflect: true },
    // post type id
    tags: { type: String, reflect: true },
    ui: { type: String, reflect: true },
    collapsible: { type: Boolean, reflect: true },
    prefilter: { type: String },
    // exclude-past | only-past
    // internal
    sortCriteria: { type: String, state: true },
    sortDirection: { type: String, state: true }
  };
  _getDataTask = new h3(this, {
    task: async ([postTypeID, lang]) => {
      const limit = 0;
      const depth = 1;
      let url;
      switch (this._host) {
        case "production":
          url = `${location.origin}/assets/posts/${lang}/${postTypeID}.json`;
          break;
        case "unonweb":
          url = `https://cms.unonweb.de:3000/api/posts-flex?where[type][equals]=${postTypeID}&locale=${lang}&draft=false&depth=${depth}&limit=${limit}`;
          break;
        case "localhost":
          url = `https://cms.localhost:3000/api/posts-flex?where[type][equals]=${postTypeID}&locale=${lang}&draft=false&depth=${depth}&limit=${limit}`;
          break;
      }
      let res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      let posts = await res.json();
      if (Array.isArray(posts.docs)) {
        posts = posts.docs;
      }
      if (this.prefilter === "exclude-past") {
        posts = posts.filter((post) => Date.parse(post.date_start) > Date.now());
      } else if (this.prefilter === "only-past") {
        posts = posts.filter((post) => Date.parse(post.date_start) < Date.now());
      }
      this._distinctTags = this.getDistinctTags(posts);
      if (this._log.includes("lifecycle")) {
        console.log("distinctTags: ", this._distinctTags);
      }
      return posts;
    },
    autoRun: true,
    args: () => [this.type, this._lang]
  });
  constructor() {
    super();
    this._log = [];
    this._log = ["lifecycle"];
    this._lang ??= document.documentElement.lang ?? "de";
    this._lang = this._lang === "" ? "de" : this._lang;
    this._host = this.setHost();
  }
  connectedCallback() {
    super.connectedCallback();
    this._filter = {
      tags: []
    };
    this.theme = this.getAttribute("date-theme");
    this.ui ??= "";
    this.sortCriteria = "date";
    this.sortDirection = "descending";
    this.prevDateStr = "";
    if (this.collapsible) {
      this.addEventListener("click", (evt) => {
        if (this._log.includes("events")) console.log(evt.target);
        if (evt.target.classList.contains("meta")) {
          evt.target.nextElementSibling.classList.toggle("hide");
        }
      });
    }
  }
  createRenderRoot() {
    return this;
  }
  /* RENDER */
  render() {
    if (this._log.includes("lifecycle")) console.log("render()");
    return this._getDataTask.render({
      pending: this.renderPending,
      complete: (posts) => this.renderComplete(posts),
      error: (error) => this.renderError(error)
    });
  }
  renderPending() {
    return x`<loading-spinner></loading-spinner>`;
  }
  renderComplete(posts) {
    this.postsFiltered = this.applyFilter(posts, this._filter.tags);
    this.applySortOrder(this.postsFiltered);
    this.prevDateStr = "";
    return x`
			${this.renderAside()}
			<div class="posts" aria-label="posts" id="posts-${this.type}">
				${this.postsFiltered.map((post) => x`${o4(post.html.main)}`)}
			</div>`;
  }
  renderError(error) {
    console.error(`<p>Oops, something went wrong: ${error.stack}</p>`);
  }
  renderAside() {
    if (this.ui.length === 0) return "";
    return x`
			<aside class="ctrls">
				${this.ui.includes("sortorder") ? this.renderCtrlSortOrder() : ""}
					${this.ui.includes("tags") ? this.renderCtrlTags() : ""}
					${this.ui.includes("toc") ? this.renderToc() : ""}
				</aside>
			${this.ui.includes("backToTopButton") ? this.renderScrollToTop() : ""}`;
  }
  renderCtrlTags() {
    if (this?._distinctTags?.length === 0) return "";
    return x`
			<fieldset class="tags" data-theme="default">
				<legend>${this.translate("tags")}</legend>
					${this._distinctTags.map((tag) => {
      return x`
								<div class="un-input">
									<input 
										type="checkbox" 
										value="${tag}"
										id="check-${tag}"
										?checked=${this._filter.tags.includes(tag)}
										@change="${(evt) => this.updateFilterTags(evt.target)}"
										data-theme="default" 
										data-entity="&#10005;">
									<label for="check-${tag}">${tag}</label>
								</div>`;
    })}
			</fieldset>`;
  }
  renderCtrlSortOrder() {
    return x`
			<fieldset class="sortorder" data-theme="default" data-dir="row">
					<legend>
						${this.translate("sort-order")}
					</legend>
					<div class="sortcriteria">
						<div class="un-input">
							<input 
								type="radio" 
								name="sortcriteria" 
								value="date" 
								id="radio-date"
								?checked=${this.sortCriteria === "date"}
								@change="${(evt) => this.sortCriteria = evt.target.value}"
								data-theme="default">
							<label for="radio-date">${this.translate("date")}</label>
						</div>
					</div>
					
					<div class="sortdirection">
						<div class="un-input">
							<input 
								type="radio" 
								name="sortdirection" 
								value="ascending" 
								id="radio-ascending"
								tabindex="-1"
								?checked=${this.sortDirection === "ascending"}
								@change="${(evt) => this.sortDirection = evt.target.value}"
								data-theme="${this.theme}">
							<label 
								for="radio-ascending"
								tabindex="1"
								aria-label=${this.translate("sort-ascending")}>${this.insertSVG("triangleUp")}
							</label>
						</div>
						<div class="un-input">
							<input 
								type="radio" 
								name="sortdirection" 
								value="descending"
								id="radio-descending"
								tabindex="-1"
								?checked=${this.sortDirection === "descending"}
								@change="${(evt) => this.sortDirection = evt.target.value}"
								data-theme="${this.theme}">
							<label 
								for="radio-descending"
								tabindex="1"
								aria-label=${this.translate("sort-descending")}>${this.insertSVG("triangleDown")}
							</label>
						</div>
					</div>
				</fieldset>`;
  }
  /* renderCtrlSortOrderCategory() {
  	return html`
  		< div class="un-input" >
  			<input
  				type="radio"
  				name="sortcriteria"
  				value="category"
  				id="radio-category"
  				?checked=${this.sortCriteria === 'category'}
  				@change="${evt => this.sortCriteria = evt.target.value}"
  	data - theme="default" >
  		<label for="radio-category">${this.lang === 'de' ? 'Kategorie' : this.lang === 'en' ? 'Category' : ''}</label>
  			</div >
  		`
  } */
  renderToc() {
    return x`
			<nav aria-label="table of contents" class="toc">
				<ul>
					${this.postsFiltered.map((post) => {
      return x`
							<li>
								<a 
									class="toc-item" 
									@click=${(evt) => this.scrollToPost(evt)}
									data-dest="${post.id}"
									href="#${post.id}">${post.title}
								</a>			
							</li>`;
    })}
				</ul>
			</nav>`;
  }
  renderScrollToTop() {
    return x`
			<a 
				href="#top"
				aria-label=${this.translate("scroll-top")}
				@click=${(evt) => this.scrollToTop(evt)}
				id="scrollToTop">&#10148;
			</a>`;
  }
  /* updated(changedProperties) {
  	if (!this._litToc) {
  		this._litToc = this.querySelector(':scope > aside > lit-toc')
  	}
  	if (this._litToc) {
  		this._litToc.requestUpdate()
  	}
  } */
  /* EVENTS */
  scrollToPost(evt) {
    evt.preventDefault();
    const postHeader = document.getElementById(evt.target.dataset.dest).querySelector("header");
    const isInViewport = this.isInViewport(postHeader);
    postHeader.classList.toggle("scrolledTo", false);
    postHeader.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    if (isInViewport) {
      postHeader.classList.add("scrolledTo");
    } else {
      document.addEventListener("scrollend", (evt2) => {
        postHeader.classList.add("scrolledTo");
        if (this._log.includes("events")) console.log('add class "scrolledTo"');
      }, { once: true, passive: true });
    }
    setTimeout(() => {
      postHeader.classList.remove("scrolledTo");
    }, 5e3);
  }
  scrollToTop(evt) {
    evt.preventDefault();
    document.querySelector("header").scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  }
  updateFilterTags(checkbox) {
    switch (checkbox.checked) {
      case true:
        this._filter.tags.push(checkbox.value);
        break;
      case false:
        this._filter.tags = this._filter.tags.filter((tag) => tag !== checkbox.value);
        break;
    }
    this.requestUpdate();
    if (this._log.includes("events")) console.log("this._filter.tags: ", this._filter.tags);
  }
  applyFilter(posts, filterTags) {
    if (this._distinctTags.length === 0) return posts;
    if (this._filter.tags.length === 0) return posts;
    if (!this?.ui?.includes("tags")) return posts;
    return posts.filter((post) => post.tags.some((tag) => filterTags.includes(tag.name)));
  }
  applySortOrder(posts) {
    if (this.sortCriteria === "date" && this.sortDirection === "descending") {
      posts.sort((a3, b3) => Date.parse(b3.date_start) - Date.parse(a3.date_start));
    } else if (this.sortCriteria === "date" && this.sortDirection === "ascending") {
      posts.sort((a3, b3) => Date.parse(a3.date_start) - Date.parse(b3.date_start));
    }
  }
  /* HELPERS */
  getDistinctTags(posts) {
    const allTags = [];
    const uniqueTags = /* @__PURE__ */ new Set();
    for (const post of posts) {
      const tagNames = [];
      post.tags ??= [];
      for (const tag of post.tags) {
        tagNames.push(tag.name);
        uniqueTags.add(tag.name);
      }
      allTags.push(tagNames);
    }
    const commonTags = this.getCommonItems(allTags);
    for (const tag of commonTags) {
      uniqueTags.delete(tag);
    }
    return Array.from(uniqueTags);
  }
  getCommonItems(arr) {
    let itemCount = [];
    let commonItemsArray = [];
    for (let i6 = 0; i6 < arr.length; i6++) {
      for (let j2 = 0; j2 < arr[i6].length; j2++) {
        if (itemCount[arr[i6][j2]]) {
          itemCount[arr[i6][j2]]++;
        } else {
          itemCount[arr[i6][j2]] = 1;
        }
        if (itemCount[arr[i6][j2]] == arr.length) {
          commonItemsArray.push(arr[i6][j2]);
        }
      }
    }
    return commonItemsArray;
  }
  insertSVG(name) {
    switch (name) {
      case "triangleUp":
        return x`<svg version = "1.1" viewBox = "0 0 100 100" xmlns = "http://www.w3.org/2000/svg" > <g transform="translate(-225.72 -100.94)"><path d="m278.46 105.25c-0.56731-1.1219-1.6096-1.8119-2.7353-1.8119-1.126 0-2.1678 0.69007-2.7353 1.8119l-44.333 87.694c-0.57072 1.1297-0.57587 2.5264-0.0106 3.6605 0.56556 1.1356 1.6113 1.8336 2.7459 1.8336h88.667c1.1329 0 2.1812-0.69994 2.7462-1.8336 0.56389-1.1337 0.56047-2.5306-0.0108-3.6605z" /></g></svg>`;
      case "triangleDown":
        return x`<svg version = "1.1" viewBox = "0 0 100 100" xmlns = "http://www.w3.org/2000/svg" > <g transform="translate(-225.72 -100.94)"><path d="m278.46 196.63c-0.56731 1.1219-1.6096 1.8119-2.7353 1.8119-1.126 0-2.1678-0.69007-2.7353-1.8119l-44.333-87.694c-0.57072-1.1297-0.57587-2.5264-0.0106-3.6605 0.56556-1.1356 1.6113-1.8336 2.7459-1.8336h88.667c1.1329 0 2.1812 0.69994 2.7462 1.8336 0.56389 1.1337 0.56047 2.5306-0.0108 3.6605z" /></g></svg>`;
    }
  }
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  setHost() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "localhost";
    } else if (location.hostname.includes("unonweb")) {
      return "unonweb";
    } else {
      return "production";
    }
  }
  translate(key) {
    const dictionary = {
      ["tags"]: {
        de: "Tags:",
        en: "Filter by tags"
      },
      ["sort-order"]: {
        de: "Sortierung",
        en: "Sort Order"
      },
      ["date"]: {
        de: "Datum",
        en: "Date"
      },
      ["sort-ascending"]: {
        de: "Aufsteigende Sortierung",
        en: "Sort Ascending"
      },
      ["sort-descending"]: {
        de: "Absteigende Sortierung",
        en: "Sort Descending"
      },
      ["scroll-top"]: {
        de: "Nach oben scrollen",
        en: "Scroll to top"
      }
    };
    return dictionary[key][this._lang];
  }
};
window.customElements.define("lit-posts", LitPosts);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/task/task.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
