import { openBlock as I, createElementBlock as H, renderSlot as Ie, defineComponent as te, ref as Ce, onMounted as Fn, onBeforeUnmount as no, createCommentVNode as Fe, inject as er, createVNode as _e, withCtx as ke, createTextVNode as nr, toDisplayString as Xe, unref as V, createElementVNode as J, h as to, toRefs as ro, computed as De, normalizeClass as tr, createBlock as X, Fragment as ot, renderList as st, withDirectives as rr, withKeys as oo, vModelText as so, nextTick as Be, Transition as ct, vShow as co, createApp as io } from "vue";
function or(n) {
	return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function ao(n) {
	if (n.__esModule)
		return n;
	var e = n.default;
	if (typeof e == "function") {
		var t = function r() {
			return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
		};
		t.prototype = e.prototype;
	} else
		t = {};
	return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(n).forEach(function (r) {
		var o = Object.getOwnPropertyDescriptor(n, r);
		Object.defineProperty(t, r, o.get ? o : {
			enumerable: !0,
			get: function () {
				return n[r];
			}
		});
	}), t;
}
function sr(n) {
	return n instanceof Map ? n.clear = n.delete = n.set = function () {
		throw new Error("map is read-only");
	} : n instanceof Set && (n.add = n.clear = n.delete = function () {
		throw new Error("set is read-only");
	}), Object.freeze(n), Object.getOwnPropertyNames(n).forEach((e) => {
		const t = n[e], r = typeof t;
		(r === "object" || r === "function") && !Object.isFrozen(t) && sr(t);
	}), n;
}
class it {
	/**
	 * @param {CompiledMode} mode
	 */
	constructor(e) {
		e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
	}
	ignoreMatch() {
		this.isMatchIgnored = !0;
	}
}
function cr(n) {
	return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function de(n, ...e) {
	const t = /* @__PURE__ */ Object.create(null);
	for (const r in n)
		t[r] = n[r];
	return e.forEach(function (r) {
		for (const o in r)
			t[o] = r[o];
	}), /** @type {T} */
		t;
}
const lo = "</span>", at = (n) => !!n.scope, uo = (n, { prefix: e }) => {
	if (n.startsWith("language:"))
		return n.replace("language:", "language-");
	if (n.includes(".")) {
		const t = n.split(".");
		return [
			`${e}${t.shift()}`,
			...t.map((r, o) => `${r}${"_".repeat(o + 1)}`)
		].join(" ");
	}
	return `${e}${n}`;
};
class fo {
	/**
	 * Creates a new HTMLRenderer
	 *
	 * @param {Tree} parseTree - the parse tree (must support `walk` API)
	 * @param {{classPrefix: string}} options
	 */
	constructor(e, t) {
		this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this);
	}
	/**
	 * Adds texts to the output stream
	 *
	 * @param {string} text */
	addText(e) {
		this.buffer += cr(e);
	}
	/**
	 * Adds a node open to the output stream (if needed)
	 *
	 * @param {Node} node */
	openNode(e) {
		if (!at(e))
			return;
		const t = uo(
			e.scope,
			{ prefix: this.classPrefix }
		);
		this.span(t);
	}
	/**
	 * Adds a node close to the output stream (if needed)
	 *
	 * @param {Node} node */
	closeNode(e) {
		at(e) && (this.buffer += lo);
	}
	/**
	 * returns the accumulated buffer
	*/
	value() {
		return this.buffer;
	}
	// helpers
	/**
	 * Builds a span element
	 *
	 * @param {string} className */
	span(e) {
		this.buffer += `<span class="${e}">`;
	}
}
const lt = (n = {}) => {
	const e = { children: [] };
	return Object.assign(e, n), e;
};
class On {
	constructor() {
		this.rootNode = lt(), this.stack = [this.rootNode];
	}
	get top() {
		return this.stack[this.stack.length - 1];
	}
	get root() {
		return this.rootNode;
	}
	/** @param {Node} node */
	add(e) {
		this.top.children.push(e);
	}
	/** @param {string} scope */
	openNode(e) {
		const t = lt({ scope: e });
		this.add(t), this.stack.push(t);
	}
	closeNode() {
		if (this.stack.length > 1)
			return this.stack.pop();
	}
	closeAllNodes() {
		for (; this.closeNode();)
			;
	}
	toJSON() {
		return JSON.stringify(this.rootNode, null, 4);
	}
	/**
	 * @typedef { import("./html_renderer").Renderer } Renderer
	 * @param {Renderer} builder
	 */
	walk(e) {
		return this.constructor._walk(e, this.rootNode);
	}
	/**
	 * @param {Renderer} builder
	 * @param {Node} node
	 */
	static _walk(e, t) {
		return typeof t == "string" ? e.addText(t) : t.children && (e.openNode(t), t.children.forEach((r) => this._walk(e, r)), e.closeNode(t)), e;
	}
	/**
	 * @param {Node} node
	 */
	static _collapse(e) {
		typeof e != "string" && e.children && (e.children.every((t) => typeof t == "string") ? e.children = [e.children.join("")] : e.children.forEach((t) => {
			On._collapse(t);
		}));
	}
}
class po extends On {
	/**
	 * @param {*} options
	 */
	constructor(e) {
		super(), this.options = e;
	}
	/**
	 * @param {string} text
	 */
	addText(e) {
		e !== "" && this.add(e);
	}
	/** @param {string} scope */
	startScope(e) {
		this.openNode(e);
	}
	endScope() {
		this.closeNode();
	}
	/**
	 * @param {Emitter & {root: DataNode}} emitter
	 * @param {string} name
	 */
	__addSublanguage(e, t) {
		const r = e.root;
		t && (r.scope = `language:${t}`), this.add(r);
	}
	toHTML() {
		return new fo(this, this.options).value();
	}
	finalize() {
		return this.closeAllNodes(), !0;
	}
}
function Pe(n) {
	return n ? typeof n == "string" ? n : n.source : null;
}
function ir(n) {
	return we("(?=", n, ")");
}
function ho(n) {
	return we("(?:", n, ")*");
}
function go(n) {
	return we("(?:", n, ")?");
}
function we(...n) {
	return n.map((t) => Pe(t)).join("");
}
function mo(n) {
	const e = n[n.length - 1];
	return typeof e == "object" && e.constructor === Object ? (n.splice(n.length - 1, 1), e) : {};
}
function Bn(...n) {
	return "(" + (mo(n).capture ? "" : "?:") + n.map((r) => Pe(r)).join("|") + ")";
}
function ar(n) {
	return new RegExp(n.toString() + "|").exec("").length - 1;
}
function bo(n, e) {
	const t = n && n.exec(e);
	return t && t.index === 0;
}
const _o = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function Pn(n, { joinWith: e }) {
	let t = 0;
	return n.map((r) => {
		t += 1;
		const o = t;
		let s = Pe(r), i = "";
		for (; s.length > 0;) {
			const c = _o.exec(s);
			if (!c) {
				i += s;
				break;
			}
			i += s.substring(0, c.index), s = s.substring(c.index + c[0].length), c[0][0] === "\\" && c[1] ? i += "\\" + String(Number(c[1]) + o) : (i += c[0], c[0] === "(" && t++);
		}
		return i;
	}).map((r) => `(${r})`).join(e);
}
const ko = /\b\B/, lr = "[a-zA-Z]\\w*", zn = "[a-zA-Z_]\\w*", ur = "\\b\\d+(\\.\\d+)?", fr = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", pr = "\\b(0b[01]+)", vo = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", xo = (n = {}) => {
	const e = /^#![ ]*\//;
	return n.binary && (n.begin = we(
		e,
		/.*\b/,
		n.binary,
		/\b.*/
	)), de({
		scope: "meta",
		begin: e,
		end: /$/,
		relevance: 0,
		/** @type {ModeCallback} */
		"on:begin": (t, r) => {
			t.index !== 0 && r.ignoreMatch();
		}
	}, n);
}, ze = {
	begin: "\\\\[\\s\\S]",
	relevance: 0
}, yo = {
	scope: "string",
	begin: "'",
	end: "'",
	illegal: "\\n",
	contains: [ze]
}, wo = {
	scope: "string",
	begin: '"',
	end: '"',
	illegal: "\\n",
	contains: [ze]
}, Eo = {
	begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
}, rn = function (n, e, t = {}) {
	const r = de(
		{
			scope: "comment",
			begin: n,
			end: e,
			contains: []
		},
		t
	);
	r.contains.push({
		scope: "doctag",
		// hack to avoid the space from being included. the space is necessary to
		// match here to prevent the plain text rule below from gobbling up doctags
		begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
		end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
		excludeBegin: !0,
		relevance: 0
	});
	const o = Bn(
		// list of common 1 and 2 letter words in English
		"I",
		"a",
		"is",
		"so",
		"us",
		"to",
		"at",
		"if",
		"in",
		"it",
		"on",
		// note: this is not an exhaustive list of contractions, just popular ones
		/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
		// contractions - can't we'd they're let's, etc
		/[A-Za-z]+[-][a-z]+/,
		// `no-way`, etc.
		/[A-Za-z][a-z]{2,}/
		// allow capitalized words at beginning of sentences
	);
	return r.contains.push(
		{
			// TODO: how to include ", (, ) without breaking grammars that use these for
			// comment delimiters?
			// begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
			// ---
			// this tries to find sequences of 3 english words in a row (without any
			// "programming" type syntax) this gives us a strong signal that we've
			// TRULY found a comment - vs perhaps scanning with the wrong language.
			// It's possible to find something that LOOKS like the start of the
			// comment - but then if there is no readable text - good chance it is a
			// false match and not a comment.
			//
			// for a visual example please see:
			// https://github.com/highlightjs/highlight.js/issues/2827
			begin: we(
				/[ ]+/,
				// necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
				"(",
				o,
				/[.]?[:]?([.][ ]|[ ])/,
				"){3}"
			)
			// look for 3 words in a row
		}
	), r;
}, Ao = rn("//", "$"), Co = rn("/\\*", "\\*/"), So = rn("#", "$"), Do = {
	scope: "number",
	begin: ur,
	relevance: 0
}, qo = {
	scope: "number",
	begin: fr,
	relevance: 0
}, To = {
	scope: "number",
	begin: pr,
	relevance: 0
}, Ro = {
	scope: "regexp",
	begin: /\/(?=[^/\n]*\/)/,
	end: /\/[gimuy]*/,
	contains: [
		ze,
		{
			begin: /\[/,
			end: /\]/,
			relevance: 0,
			contains: [ze]
		}
	]
}, No = {
	scope: "title",
	begin: lr,
	relevance: 0
}, Mo = {
	scope: "title",
	begin: zn,
	relevance: 0
}, Lo = {
	// excludes method names from keyword processing
	begin: "\\.\\s*" + zn,
	relevance: 0
}, Io = function (n) {
	return Object.assign(
		n,
		{
			/** @type {ModeCallback} */
			"on:begin": (e, t) => {
				t.data._beginMatch = e[1];
			},
			/** @type {ModeCallback} */
			"on:end": (e, t) => {
				t.data._beginMatch !== e[1] && t.ignoreMatch();
			}
		}
	);
};
var Ze = /* @__PURE__ */ Object.freeze({
	__proto__: null,
	APOS_STRING_MODE: yo,
	BACKSLASH_ESCAPE: ze,
	BINARY_NUMBER_MODE: To,
	BINARY_NUMBER_RE: pr,
	COMMENT: rn,
	C_BLOCK_COMMENT_MODE: Co,
	C_LINE_COMMENT_MODE: Ao,
	C_NUMBER_MODE: qo,
	C_NUMBER_RE: fr,
	END_SAME_AS_BEGIN: Io,
	HASH_COMMENT_MODE: So,
	IDENT_RE: lr,
	MATCH_NOTHING_RE: ko,
	METHOD_GUARD: Lo,
	NUMBER_MODE: Do,
	NUMBER_RE: ur,
	PHRASAL_WORDS_MODE: Eo,
	QUOTE_STRING_MODE: wo,
	REGEXP_MODE: Ro,
	RE_STARTERS_RE: vo,
	SHEBANG: xo,
	TITLE_MODE: No,
	UNDERSCORE_IDENT_RE: zn,
	UNDERSCORE_TITLE_MODE: Mo
});
function Fo(n, e) {
	n.input[n.index - 1] === "." && e.ignoreMatch();
}
function Oo(n, e) {
	n.className !== void 0 && (n.scope = n.className, delete n.className);
}
function Bo(n, e) {
	e && n.beginKeywords && (n.begin = "\\b(" + n.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", n.__beforeBegin = Fo, n.keywords = n.keywords || n.beginKeywords, delete n.beginKeywords, n.relevance === void 0 && (n.relevance = 0));
}
function Po(n, e) {
	Array.isArray(n.illegal) && (n.illegal = Bn(...n.illegal));
}
function zo(n, e) {
	if (n.match) {
		if (n.begin || n.end)
			throw new Error("begin & end are not supported with match");
		n.begin = n.match, delete n.match;
	}
}
function $o(n, e) {
	n.relevance === void 0 && (n.relevance = 1);
}
const Uo = (n, e) => {
	if (!n.beforeMatch)
		return;
	if (n.starts)
		throw new Error("beforeMatch cannot be used with starts");
	const t = Object.assign({}, n);
	Object.keys(n).forEach((r) => {
		delete n[r];
	}), n.keywords = t.keywords, n.begin = we(t.beforeMatch, ir(t.begin)), n.starts = {
		relevance: 0,
		contains: [
			Object.assign(t, { endsParent: !0 })
		]
	}, n.relevance = 0, delete t.beforeMatch;
}, Vo = [
	"of",
	"and",
	"for",
	"in",
	"not",
	"or",
	"if",
	"then",
	"parent",
	// common variable name
	"list",
	// common variable name
	"value"
	// common variable name
], Ho = "keyword";
function hr(n, e, t = Ho) {
	const r = /* @__PURE__ */ Object.create(null);
	return typeof n == "string" ? o(t, n.split(" ")) : Array.isArray(n) ? o(t, n) : Object.keys(n).forEach(function (s) {
		Object.assign(
			r,
			hr(n[s], e, s)
		);
	}), r;
	function o(s, i) {
		e && (i = i.map((c) => c.toLowerCase())), i.forEach(function (c) {
			const a = c.split("|");
			r[a[0]] = [s, Go(a[0], a[1])];
		});
	}
}
function Go(n, e) {
	return e ? Number(e) : jo(n) ? 0 : 1;
}
function jo(n) {
	return Vo.includes(n.toLowerCase());
}
const ut = {}, ve = (n) => {
	console.error(n);
}, ft = (n, ...e) => {
	console.log(`WARN: ${n}`, ...e);
}, Ee = (n, e) => {
	ut[`${n}/${e}`] || (console.log(`Deprecated as of ${n}. ${e}`), ut[`${n}/${e}`] = !0);
}, Qe = new Error();
function dr(n, e, { key: t }) {
	let r = 0;
	const o = n[t], s = {}, i = {};
	for (let c = 1; c <= e.length; c++)
		i[c + r] = o[c], s[c + r] = !0, r += ar(e[c - 1]);
	n[t] = i, n[t]._emit = s, n[t]._multi = !0;
}
function Zo(n) {
	if (Array.isArray(n.begin)) {
		if (n.skip || n.excludeBegin || n.returnBegin)
			throw ve("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Qe;
		if (typeof n.beginScope != "object" || n.beginScope === null)
			throw ve("beginScope must be object"), Qe;
		dr(n, n.begin, { key: "beginScope" }), n.begin = Pn(n.begin, { joinWith: "" });
	}
}
function Wo(n) {
	if (Array.isArray(n.end)) {
		if (n.skip || n.excludeEnd || n.returnEnd)
			throw ve("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Qe;
		if (typeof n.endScope != "object" || n.endScope === null)
			throw ve("endScope must be object"), Qe;
		dr(n, n.end, { key: "endScope" }), n.end = Pn(n.end, { joinWith: "" });
	}
}
function Ko(n) {
	n.scope && typeof n.scope == "object" && n.scope !== null && (n.beginScope = n.scope, delete n.scope);
}
function Jo(n) {
	Ko(n), typeof n.beginScope == "string" && (n.beginScope = { _wrap: n.beginScope }), typeof n.endScope == "string" && (n.endScope = { _wrap: n.endScope }), Zo(n), Wo(n);
}
function Yo(n) {
	function e(i, c) {
		return new RegExp(
			Pe(i),
			"m" + (n.case_insensitive ? "i" : "") + (n.unicodeRegex ? "u" : "") + (c ? "g" : "")
		);
	}
	class t {
		constructor() {
			this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
		}
		// @ts-ignore
		addRule(c, a) {
			a.position = this.position++, this.matchIndexes[this.matchAt] = a, this.regexes.push([a, c]), this.matchAt += ar(c) + 1;
		}
		compile() {
			this.regexes.length === 0 && (this.exec = () => null);
			const c = this.regexes.map((a) => a[1]);
			this.matcherRe = e(Pn(c, { joinWith: "|" }), !0), this.lastIndex = 0;
		}
		/** @param {string} s */
		exec(c) {
			this.matcherRe.lastIndex = this.lastIndex;
			const a = this.matcherRe.exec(c);
			if (!a)
				return null;
			const l = a.findIndex((h, f) => f > 0 && h !== void 0), u = this.matchIndexes[l];
			return a.splice(0, l), Object.assign(a, u);
		}
	}
	class r {
		constructor() {
			this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
		}
		// @ts-ignore
		getMatcher(c) {
			if (this.multiRegexes[c])
				return this.multiRegexes[c];
			const a = new t();
			return this.rules.slice(c).forEach(([l, u]) => a.addRule(l, u)), a.compile(), this.multiRegexes[c] = a, a;
		}
		resumingScanAtSamePosition() {
			return this.regexIndex !== 0;
		}
		considerAll() {
			this.regexIndex = 0;
		}
		// @ts-ignore
		addRule(c, a) {
			this.rules.push([c, a]), a.type === "begin" && this.count++;
		}
		/** @param {string} s */
		exec(c) {
			const a = this.getMatcher(this.regexIndex);
			a.lastIndex = this.lastIndex;
			let l = a.exec(c);
			if (this.resumingScanAtSamePosition() && !(l && l.index === this.lastIndex)) {
				const u = this.getMatcher(0);
				u.lastIndex = this.lastIndex + 1, l = u.exec(c);
			}
			return l && (this.regexIndex += l.position + 1, this.regexIndex === this.count && this.considerAll()), l;
		}
	}
	function o(i) {
		const c = new r();
		return i.contains.forEach((a) => c.addRule(a.begin, { rule: a, type: "begin" })), i.terminatorEnd && c.addRule(i.terminatorEnd, { type: "end" }), i.illegal && c.addRule(i.illegal, { type: "illegal" }), c;
	}
	function s(i, c) {
		const a = (
			/** @type CompiledMode */
			i
		);
		if (i.isCompiled)
			return a;
		[
			Oo,
			// do this early so compiler extensions generally don't have to worry about
			// the distinction between match/begin
			zo,
			Jo,
			Uo
		].forEach((u) => u(i, c)), n.compilerExtensions.forEach((u) => u(i, c)), i.__beforeBegin = null, [
			Bo,
			// do this later so compiler extensions that come earlier have access to the
			// raw array if they wanted to perhaps manipulate it, etc.
			Po,
			// default to 1 relevance if not specified
			$o
		].forEach((u) => u(i, c)), i.isCompiled = !0;
		let l = null;
		return typeof i.keywords == "object" && i.keywords.$pattern && (i.keywords = Object.assign({}, i.keywords), l = i.keywords.$pattern, delete i.keywords.$pattern), l = l || /\w+/, i.keywords && (i.keywords = hr(i.keywords, n.case_insensitive)), a.keywordPatternRe = e(l, !0), c && (i.begin || (i.begin = /\B|\b/), a.beginRe = e(a.begin), !i.end && !i.endsWithParent && (i.end = /\B|\b/), i.end && (a.endRe = e(a.end)), a.terminatorEnd = Pe(a.end) || "", i.endsWithParent && c.terminatorEnd && (a.terminatorEnd += (i.end ? "|" : "") + c.terminatorEnd)), i.illegal && (a.illegalRe = e(
			/** @type {RegExp | string} */
			i.illegal
		)), i.contains || (i.contains = []), i.contains = [].concat(...i.contains.map(function (u) {
			return Xo(u === "self" ? i : u);
		})), i.contains.forEach(function (u) {
			s(
				/** @type Mode */
				u,
				a
			);
		}), i.starts && s(i.starts, c), a.matcher = o(a), a;
	}
	if (n.compilerExtensions || (n.compilerExtensions = []), n.contains && n.contains.includes("self"))
		throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
	return n.classNameAliases = de(n.classNameAliases || {}), s(
		/** @type Mode */
		n
	);
}
function gr(n) {
	return n ? n.endsWithParent || gr(n.starts) : !1;
}
function Xo(n) {
	return n.variants && !n.cachedVariants && (n.cachedVariants = n.variants.map(function (e) {
		return de(n, { variants: null }, e);
	})), n.cachedVariants ? n.cachedVariants : gr(n) ? de(n, { starts: n.starts ? de(n.starts) : null }) : Object.isFrozen(n) ? de(n) : n;
}
var Qo = "11.9.0";
class es extends Error {
	constructor(e, t) {
		super(e), this.name = "HTMLInjectionError", this.html = t;
	}
}
const _n = cr, pt = de, ht = Symbol("nomatch"), ns = 7, mr = function (n) {
	const e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null), r = [];
	let o = !0;
	const s = "Could not find the language '{}', did you forget to load/include a language module?", i = { disableAutodetect: !0, name: "Plain text", contains: [] };
	let c = {
		ignoreUnescapedHTML: !1,
		throwUnescapedHTML: !1,
		noHighlightRe: /^(no-?highlight)$/i,
		languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
		classPrefix: "hljs-",
		cssSelector: "pre code",
		languages: null,
		// beta configuration options, subject to change, welcome to discuss
		// https://github.com/highlightjs/highlight.js/issues/1086
		__emitter: po
	};
	function a(d) {
		return c.noHighlightRe.test(d);
	}
	function l(d) {
		let x = d.className + " ";
		x += d.parentNode ? d.parentNode.className : "";
		const D = c.languageDetectRe.exec(x);
		if (D) {
			const L = G(D[1]);
			return L || (ft(s.replace("{}", D[1])), ft("Falling back to no-highlight mode for this block.", d)), L ? D[1] : "no-highlight";
		}
		return x.split(/\s+/).find((L) => a(L) || G(L));
	}
	function u(d, x, D) {
		let L = "", U = "";
		typeof x == "object" ? (L = d, D = x.ignoreIllegals, U = x.language) : (Ee("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ee("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), U = d, L = x), D === void 0 && (D = !0);
		const K = {
			code: L,
			language: U
		};
		O("before:highlight", K);
		const ne = K.result ? K.result : h(K.language, K.code, D);
		return ne.code = K.code, O("after:highlight", ne), ne;
	}
	function h(d, x, D, L) {
		const U = /* @__PURE__ */ Object.create(null);
		function K(v, E) {
			return v.keywords[E];
		}
		function ne() {
			if (!S.keywords) {
				j.addText(z);
				return;
			}
			let v = 0;
			S.keywordPatternRe.lastIndex = 0;
			let E = S.keywordPatternRe.exec(z), T = "";
			for (; E;) {
				T += z.substring(v, E.index);
				const B = ce.case_insensitive ? E[0].toLowerCase() : E[0], W = K(S, B);
				if (W) {
					const [pe, Qr] = W;
					if (j.addText(T), T = "", U[B] = (U[B] || 0) + 1, U[B] <= ns && (je += Qr), pe.startsWith("_"))
						T += E[0];
					else {
						const eo = ce.classNameAliases[pe] || pe;
						se(E[0], eo);
					}
				} else
					T += E[0];
				v = S.keywordPatternRe.lastIndex, E = S.keywordPatternRe.exec(z);
			}
			T += z.substring(v), j.addText(T);
		}
		function He() {
			if (z === "")
				return;
			let v = null;
			if (typeof S.subLanguage == "string") {
				if (!e[S.subLanguage]) {
					j.addText(z);
					return;
				}
				v = h(S.subLanguage, z, !0, rt[S.subLanguage]), rt[S.subLanguage] = /** @type {CompiledMode} */
					v._top;
			} else
				v = p(z, S.subLanguage.length ? S.subLanguage : null);
			S.relevance > 0 && (je += v.relevance), j.__addSublanguage(v._emitter, v.language);
		}
		function Y() {
			S.subLanguage != null ? He() : ne(), z = "";
		}
		function se(v, E) {
			v !== "" && (j.startScope(E), j.addText(v), j.endScope());
		}
		function Qn(v, E) {
			let T = 1;
			const B = E.length - 1;
			for (; T <= B;) {
				if (!v._emit[T]) {
					T++;
					continue;
				}
				const W = ce.classNameAliases[v[T]] || v[T], pe = E[T];
				W ? se(pe, W) : (z = pe, ne(), z = ""), T++;
			}
		}
		function et(v, E) {
			return v.scope && typeof v.scope == "string" && j.openNode(ce.classNameAliases[v.scope] || v.scope), v.beginScope && (v.beginScope._wrap ? (se(z, ce.classNameAliases[v.beginScope._wrap] || v.beginScope._wrap), z = "") : v.beginScope._multi && (Qn(v.beginScope, E), z = "")), S = Object.create(v, { parent: { value: S } }), S;
		}
		function nt(v, E, T) {
			let B = bo(v.endRe, T);
			if (B) {
				if (v["on:end"]) {
					const W = new it(v);
					v["on:end"](E, W), W.isMatchIgnored && (B = !1);
				}
				if (B) {
					for (; v.endsParent && v.parent;)
						v = v.parent;
					return v;
				}
			}
			if (v.endsWithParent)
				return nt(v.parent, E, T);
		}
		function Wr(v) {
			return S.matcher.regexIndex === 0 ? (z += v[0], 1) : (bn = !0, 0);
		}
		function Kr(v) {
			const E = v[0], T = v.rule, B = new it(T), W = [T.__beforeBegin, T["on:begin"]];
			for (const pe of W)
				if (pe && (pe(v, B), B.isMatchIgnored))
					return Wr(E);
			return T.skip ? z += E : (T.excludeBegin && (z += E), Y(), !T.returnBegin && !T.excludeBegin && (z = E)), et(T, v), T.returnBegin ? 0 : E.length;
		}
		function Jr(v) {
			const E = v[0], T = x.substring(v.index), B = nt(S, v, T);
			if (!B)
				return ht;
			const W = S;
			S.endScope && S.endScope._wrap ? (Y(), se(E, S.endScope._wrap)) : S.endScope && S.endScope._multi ? (Y(), Qn(S.endScope, v)) : W.skip ? z += E : (W.returnEnd || W.excludeEnd || (z += E), Y(), W.excludeEnd && (z = E));
			do
				S.scope && j.closeNode(), !S.skip && !S.subLanguage && (je += S.relevance), S = S.parent;
			while (S !== B.parent);
			return B.starts && et(B.starts, v), W.returnEnd ? 0 : E.length;
		}
		function Yr() {
			const v = [];
			for (let E = S; E !== ce; E = E.parent)
				E.scope && v.unshift(E.scope);
			v.forEach((E) => j.openNode(E));
		}
		let Ge = {};
		function tt(v, E) {
			const T = E && E[0];
			if (z += v, T == null)
				return Y(), 0;
			if (Ge.type === "begin" && E.type === "end" && Ge.index === E.index && T === "") {
				if (z += x.slice(E.index, E.index + 1), !o) {
					const B = new Error(`0 width match regex (${d})`);
					throw B.languageName = d, B.badRule = Ge.rule, B;
				}
				return 1;
			}
			if (Ge = E, E.type === "begin")
				return Kr(E);
			if (E.type === "illegal" && !D) {
				const B = new Error('Illegal lexeme "' + T + '" for mode "' + (S.scope || "<unnamed>") + '"');
				throw B.mode = S, B;
			} else if (E.type === "end") {
				const B = Jr(E);
				if (B !== ht)
					return B;
			}
			if (E.type === "illegal" && T === "")
				return 1;
			if (mn > 1e5 && mn > E.index * 3)
				throw new Error("potential infinite loop, way more iterations than matches");
			return z += T, T.length;
		}
		const ce = G(d);
		if (!ce)
			throw ve(s.replace("{}", d)), new Error('Unknown language: "' + d + '"');
		const Xr = Yo(ce);
		let gn = "", S = L || Xr;
		const rt = {}, j = new c.__emitter(c);
		Yr();
		let z = "", je = 0, ge = 0, mn = 0, bn = !1;
		try {
			if (ce.__emitTokens)
				ce.__emitTokens(x, j);
			else {
				for (S.matcher.considerAll(); ;) {
					mn++, bn ? bn = !1 : S.matcher.considerAll(), S.matcher.lastIndex = ge;
					const v = S.matcher.exec(x);
					if (!v)
						break;
					const E = x.substring(ge, v.index), T = tt(E, v);
					ge = v.index + T;
				}
				tt(x.substring(ge));
			}
			return j.finalize(), gn = j.toHTML(), {
				language: d,
				value: gn,
				relevance: je,
				illegal: !1,
				_emitter: j,
				_top: S
			};
		} catch (v) {
			if (v.message && v.message.includes("Illegal"))
				return {
					language: d,
					value: _n(x),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: v.message,
						index: ge,
						context: x.slice(ge - 100, ge + 100),
						mode: v.mode,
						resultSoFar: gn
					},
					_emitter: j
				};
			if (o)
				return {
					language: d,
					value: _n(x),
					illegal: !1,
					relevance: 0,
					errorRaised: v,
					_emitter: j,
					_top: S
				};
			throw v;
		}
	}
	function f(d) {
		const x = {
			value: _n(d),
			illegal: !1,
			relevance: 0,
			_top: i,
			_emitter: new c.__emitter(c)
		};
		return x._emitter.addText(d), x;
	}
	function p(d, x) {
		x = x || c.languages || Object.keys(e);
		const D = f(d), L = x.filter(G).filter(P).map(
			(Y) => h(Y, d, !1)
		);
		L.unshift(D);
		const U = L.sort((Y, se) => {
			if (Y.relevance !== se.relevance)
				return se.relevance - Y.relevance;
			if (Y.language && se.language) {
				if (G(Y.language).supersetOf === se.language)
					return 1;
				if (G(se.language).supersetOf === Y.language)
					return -1;
			}
			return 0;
		}), [K, ne] = U, He = K;
		return He.secondBest = ne, He;
	}
	function g(d, x, D) {
		const L = x && t[x] || D;
		d.classList.add("hljs"), d.classList.add(`language-${L}`);
	}
	function k(d) {
		let x = null;
		const D = l(d);
		if (a(D))
			return;
		if (O(
			"before:highlightElement",
			{ el: d, language: D }
		), d.dataset.highlighted) {
			console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", d);
			return;
		}
		if (d.children.length > 0 && (c.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(d)), c.throwUnescapedHTML))
			throw new es(
				"One of your code blocks includes unescaped HTML.",
				d.innerHTML
			);
		x = d;
		const L = x.textContent, U = D ? u(L, { language: D, ignoreIllegals: !0 }) : p(L);
		d.innerHTML = U.value, d.dataset.highlighted = "yes", g(d, D, U.language), d.result = {
			language: U.language,
			// TODO: remove with version 11.0
			re: U.relevance,
			relevance: U.relevance
		}, U.secondBest && (d.secondBest = {
			language: U.secondBest.language,
			relevance: U.secondBest.relevance
		}), O("after:highlightElement", { el: d, result: U, text: L });
	}
	function A(d) {
		c = pt(c, d);
	}
	const y = () => {
		C(), Ee("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
	};
	function m() {
		C(), Ee("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
	}
	let w = !1;
	function C() {
		if (document.readyState === "loading") {
			w = !0;
			return;
		}
		document.querySelectorAll(c.cssSelector).forEach(k);
	}
	function q() {
		w && C();
	}
	typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", q, !1);
	function _(d, x) {
		let D = null;
		try {
			D = x(n);
		} catch (L) {
			if (ve("Language definition for '{}' could not be registered.".replace("{}", d)), o)
				ve(L);
			else
				throw L;
			D = i;
		}
		D.name || (D.name = d), e[d] = D, D.rawDefinition = x.bind(null, n), D.aliases && R(D.aliases, { languageName: d });
	}
	function M(d) {
		delete e[d];
		for (const x of Object.keys(t))
			t[x] === d && delete t[x];
	}
	function $() {
		return Object.keys(e);
	}
	function G(d) {
		return d = (d || "").toLowerCase(), e[d] || e[t[d]];
	}
	function R(d, { languageName: x }) {
		typeof d == "string" && (d = [d]), d.forEach((D) => {
			t[D.toLowerCase()] = x;
		});
	}
	function P(d) {
		const x = G(d);
		return x && !x.disableAutodetect;
	}
	function fe(d) {
		d["before:highlightBlock"] && !d["before:highlightElement"] && (d["before:highlightElement"] = (x) => {
			d["before:highlightBlock"](
				Object.assign({ block: x.el }, x)
			);
		}), d["after:highlightBlock"] && !d["after:highlightElement"] && (d["after:highlightElement"] = (x) => {
			d["after:highlightBlock"](
				Object.assign({ block: x.el }, x)
			);
		});
	}
	function oe(d) {
		fe(d), r.push(d);
	}
	function b(d) {
		const x = r.indexOf(d);
		x !== -1 && r.splice(x, 1);
	}
	function O(d, x) {
		const D = d;
		r.forEach(function (L) {
			L[D] && L[D](x);
		});
	}
	function N(d) {
		return Ee("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ee("10.7.0", "Please use highlightElement now."), k(d);
	}
	Object.assign(n, {
		highlight: u,
		highlightAuto: p,
		highlightAll: C,
		highlightElement: k,
		// TODO: Remove with v12 API
		highlightBlock: N,
		configure: A,
		initHighlighting: y,
		initHighlightingOnLoad: m,
		registerLanguage: _,
		unregisterLanguage: M,
		listLanguages: $,
		getLanguage: G,
		registerAliases: R,
		autoDetection: P,
		inherit: pt,
		addPlugin: oe,
		removePlugin: b
	}), n.debugMode = function () {
		o = !1;
	}, n.safeMode = function () {
		o = !0;
	}, n.versionString = Qo, n.regex = {
		concat: we,
		lookahead: ir,
		either: Bn,
		optional: go,
		anyNumberOfTimes: ho
	};
	for (const d in Ze)
		typeof Ze[d] == "object" && sr(Ze[d]);
	return Object.assign(n, Ze), n;
}, qe = mr({});
qe.newInstance = () => mr({});
var ts = qe;
qe.HighlightJS = qe;
qe.default = qe;
const en = /* @__PURE__ */ or(ts);
function rs(n) {
	const e = n.regex, t = e.concat(/[\p{L}_]/u, e.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = /[\p{L}0-9._:-]+/u, o = {
		className: "symbol",
		begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
	}, s = {
		begin: /\s/,
		contains: [
			{
				className: "keyword",
				begin: /#?[a-z_][a-z1-9_-]+/,
				illegal: /\n/
			}
		]
	}, i = n.inherit(s, {
		begin: /\(/,
		end: /\)/
	}), c = n.inherit(n.APOS_STRING_MODE, { className: "string" }), a = n.inherit(n.QUOTE_STRING_MODE, { className: "string" }), l = {
		endsWithParent: !0,
		illegal: /</,
		relevance: 0,
		contains: [
			{
				className: "attr",
				begin: r,
				relevance: 0
			},
			{
				begin: /=\s*/,
				relevance: 0,
				contains: [
					{
						className: "string",
						endsParent: !0,
						variants: [
							{
								begin: /"/,
								end: /"/,
								contains: [o]
							},
							{
								begin: /'/,
								end: /'/,
								contains: [o]
							},
							{ begin: /[^\s"'=<>`]+/ }
						]
					}
				]
			}
		]
	};
	return {
		name: "HTML, XML",
		aliases: [
			"html",
			"xhtml",
			"rss",
			"atom",
			"xjb",
			"xsd",
			"xsl",
			"plist",
			"wsf",
			"svg"
		],
		case_insensitive: !0,
		unicodeRegex: !0,
		contains: [
			{
				className: "meta",
				begin: /<![a-z]/,
				end: />/,
				relevance: 10,
				contains: [
					s,
					a,
					c,
					i,
					{
						begin: /\[/,
						end: /\]/,
						contains: [
							{
								className: "meta",
								begin: /<![a-z]/,
								end: />/,
								contains: [
									s,
									i,
									a,
									c
								]
							}
						]
					}
				]
			},
			n.COMMENT(
				/<!--/,
				/-->/,
				{ relevance: 10 }
			),
			{
				begin: /<!\[CDATA\[/,
				end: /\]\]>/,
				relevance: 10
			},
			o,
			// xml processing instructions
			{
				className: "meta",
				end: /\?>/,
				variants: [
					{
						begin: /<\?xml/,
						relevance: 10,
						contains: [
							a
						]
					},
					{
						begin: /<\?[a-z][a-z0-9]+/
					}
				]
			},
			{
				className: "tag",
				/*
				The lookahead pattern (?=...) ensures that 'begin' only matches
				'<style' as a single word, followed by a whitespace or an
				ending bracket.
				*/
				begin: /<style(?=\s|>)/,
				end: />/,
				keywords: { name: "style" },
				contains: [l],
				starts: {
					end: /<\/style>/,
					returnEnd: !0,
					subLanguage: [
						"css",
						"xml"
					]
				}
			},
			{
				className: "tag",
				// See the comment in the <style tag about the lookahead pattern
				begin: /<script(?=\s|>)/,
				end: />/,
				keywords: { name: "script" },
				contains: [l],
				starts: {
					end: /<\/script>/,
					returnEnd: !0,
					subLanguage: [
						"javascript",
						"handlebars",
						"xml"
					]
				}
			},
			// we need this for now for jSX
			{
				className: "tag",
				begin: /<>|<\/>/
			},
			// open tag
			{
				className: "tag",
				begin: e.concat(
					/</,
					e.lookahead(e.concat(
						t,
						// <tag/>
						// <tag>
						// <tag ...
						e.either(/\/>/, />/, /\s/)
					))
				),
				end: /\/?>/,
				contains: [
					{
						className: "name",
						begin: t,
						relevance: 0,
						starts: l
					}
				]
			},
			// close tag
			{
				className: "tag",
				begin: e.concat(
					/<\//,
					e.lookahead(e.concat(
						t,
						/>/
					))
				),
				contains: [
					{
						className: "name",
						begin: t,
						relevance: 0
					},
					{
						begin: />/,
						relevance: 0,
						endsParent: !0
					}
				]
			}
		]
	};
}
const dt = "[A-Za-z$_][0-9A-Za-z$_]*", os = [
	"as",
	// for exports
	"in",
	"of",
	"if",
	"for",
	"while",
	"finally",
	"var",
	"new",
	"function",
	"do",
	"return",
	"void",
	"else",
	"break",
	"catch",
	"instanceof",
	"with",
	"throw",
	"case",
	"default",
	"try",
	"switch",
	"continue",
	"typeof",
	"delete",
	"let",
	"yield",
	"const",
	"class",
	// JS handles these with a special rule
	// "get",
	// "set",
	"debugger",
	"async",
	"await",
	"static",
	"import",
	"from",
	"export",
	"extends"
], ss = [
	"true",
	"false",
	"null",
	"undefined",
	"NaN",
	"Infinity"
], br = [
	// Fundamental objects
	"Object",
	"Function",
	"Boolean",
	"Symbol",
	// numbers and dates
	"Math",
	"Date",
	"Number",
	"BigInt",
	// text
	"String",
	"RegExp",
	// Indexed collections
	"Array",
	"Float32Array",
	"Float64Array",
	"Int8Array",
	"Uint8Array",
	"Uint8ClampedArray",
	"Int16Array",
	"Int32Array",
	"Uint16Array",
	"Uint32Array",
	"BigInt64Array",
	"BigUint64Array",
	// Keyed collections
	"Set",
	"Map",
	"WeakSet",
	"WeakMap",
	// Structured data
	"ArrayBuffer",
	"SharedArrayBuffer",
	"Atomics",
	"DataView",
	"JSON",
	// Control abstraction objects
	"Promise",
	"Generator",
	"GeneratorFunction",
	"AsyncFunction",
	// Reflection
	"Reflect",
	"Proxy",
	// Internationalization
	"Intl",
	// WebAssembly
	"WebAssembly"
], _r = [
	"Error",
	"EvalError",
	"InternalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError"
], kr = [
	"setInterval",
	"setTimeout",
	"clearInterval",
	"clearTimeout",
	"require",
	"exports",
	"eval",
	"isFinite",
	"isNaN",
	"parseFloat",
	"parseInt",
	"decodeURI",
	"decodeURIComponent",
	"encodeURI",
	"encodeURIComponent",
	"escape",
	"unescape"
], cs = [
	"arguments",
	"this",
	"super",
	"console",
	"window",
	"document",
	"localStorage",
	"sessionStorage",
	"module",
	"global"
	// Node.js
], is = [].concat(
	kr,
	br,
	_r
);
function as(n) {
	const e = n.regex, t = (x, { after: D }) => {
		const L = "</" + x[0].slice(1);
		return x.input.indexOf(L, D) !== -1;
	}, r = dt, o = {
		begin: "<>",
		end: "</>"
	}, s = /<[A-Za-z0-9\\._:-]+\s*\/>/, i = {
		begin: /<[A-Za-z0-9\\._:-]+/,
		end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
		/**
		 * @param {RegExpMatchArray} match
		 * @param {CallbackResponse} response
		 */
		isTrulyOpeningTag: (x, D) => {
			const L = x[0].length + x.index, U = x.input[L];
			if (
				// HTML should not include another raw `<` inside a tag
				// nested type?
				// `<Array<Array<number>>`, etc.
				U === "<" || // the , gives away that this is not HTML
				// `<T, A extends keyof T, V>`
				U === ","
			) {
				D.ignoreMatch();
				return;
			}
			U === ">" && (t(x, { after: L }) || D.ignoreMatch());
			let K;
			const ne = x.input.substring(L);
			if (K = ne.match(/^\s*=/)) {
				D.ignoreMatch();
				return;
			}
			if ((K = ne.match(/^\s+extends\s+/)) && K.index === 0) {
				D.ignoreMatch();
				return;
			}
		}
	}, c = {
		$pattern: dt,
		keyword: os,
		literal: ss,
		built_in: is,
		"variable.language": cs
	}, a = "[0-9](_?[0-9])*", l = `\\.(${a})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", h = {
		className: "number",
		variants: [
			// DecimalLiteral
			{ begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${a})\\b` },
			{ begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
			// DecimalBigIntegerLiteral
			{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
			// NonDecimalIntegerLiteral
			{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
			{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
			{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
			// LegacyOctalIntegerLiteral (does not include underscore separators)
			// https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
			{ begin: "\\b0[0-7]+n?\\b" }
		],
		relevance: 0
	}, f = {
		className: "subst",
		begin: "\\$\\{",
		end: "\\}",
		keywords: c,
		contains: []
		// defined later
	}, p = {
		begin: "html`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [
				n.BACKSLASH_ESCAPE,
				f
			],
			subLanguage: "xml"
		}
	}, g = {
		begin: "css`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [
				n.BACKSLASH_ESCAPE,
				f
			],
			subLanguage: "css"
		}
	}, k = {
		begin: "gql`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [
				n.BACKSLASH_ESCAPE,
				f
			],
			subLanguage: "graphql"
		}
	}, A = {
		className: "string",
		begin: "`",
		end: "`",
		contains: [
			n.BACKSLASH_ESCAPE,
			f
		]
	}, m = {
		className: "comment",
		variants: [
			n.COMMENT(
				/\/\*\*(?!\/)/,
				"\\*/",
				{
					relevance: 0,
					contains: [
						{
							begin: "(?=@[A-Za-z]+)",
							relevance: 0,
							contains: [
								{
									className: "doctag",
									begin: "@[A-Za-z]+"
								},
								{
									className: "type",
									begin: "\\{",
									end: "\\}",
									excludeEnd: !0,
									excludeBegin: !0,
									relevance: 0
								},
								{
									className: "variable",
									begin: r + "(?=\\s*(-)|$)",
									endsParent: !0,
									relevance: 0
								},
								// eat spaces (not newlines) so we can find
								// types or variables
								{
									begin: /(?=[^\n])\s/,
									relevance: 0
								}
							]
						}
					]
				}
			),
			n.C_BLOCK_COMMENT_MODE,
			n.C_LINE_COMMENT_MODE
		]
	}, w = [
		n.APOS_STRING_MODE,
		n.QUOTE_STRING_MODE,
		p,
		g,
		k,
		A,
		// Skip numbers when they are part of a variable name
		{ match: /\$\d+/ },
		h
		// This is intentional:
		// See https://github.com/highlightjs/highlight.js/issues/3288
		// hljs.REGEXP_MODE
	];
	f.contains = w.concat({
		// we need to pair up {} inside our subst to prevent
		// it from ending too early by matching another }
		begin: /\{/,
		end: /\}/,
		keywords: c,
		contains: [
			"self"
		].concat(w)
	});
	const C = [].concat(m, f.contains), q = C.concat([
		// eat recursive parens in sub expressions
		{
			begin: /\(/,
			end: /\)/,
			keywords: c,
			contains: ["self"].concat(C)
		}
	]), _ = {
		className: "params",
		begin: /\(/,
		end: /\)/,
		excludeBegin: !0,
		excludeEnd: !0,
		keywords: c,
		contains: q
	}, M = {
		variants: [
			// class Car extends vehicle
			{
				match: [
					/class/,
					/\s+/,
					r,
					/\s+/,
					/extends/,
					/\s+/,
					e.concat(r, "(", e.concat(/\./, r), ")*")
				],
				scope: {
					1: "keyword",
					3: "title.class",
					5: "keyword",
					7: "title.class.inherited"
				}
			},
			// class Car
			{
				match: [
					/class/,
					/\s+/,
					r
				],
				scope: {
					1: "keyword",
					3: "title.class"
				}
			}
		]
	}, $ = {
		relevance: 0,
		match: e.either(
			// Hard coded exceptions
			/\bJSON/,
			// Float32Array, OutT
			/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
			// CSSFactory, CSSFactoryT
			/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
			// FPs, FPsT
			/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
			// P
			// single letters are not highlighted
			// BLAH
			// this will be flagged as a UPPER_CASE_CONSTANT instead
		),
		className: "title.class",
		keywords: {
			_: [
				// se we still get relevance credit for JS library classes
				...br,
				..._r
			]
		}
	}, G = {
		label: "use_strict",
		className: "meta",
		relevance: 10,
		begin: /^\s*['"]use (strict|asm)['"]/
	}, R = {
		variants: [
			{
				match: [
					/function/,
					/\s+/,
					r,
					/(?=\s*\()/
				]
			},
			// anonymous function
			{
				match: [
					/function/,
					/\s*(?=\()/
				]
			}
		],
		className: {
			1: "keyword",
			3: "title.function"
		},
		label: "func.def",
		contains: [_],
		illegal: /%/
	}, P = {
		relevance: 0,
		match: /\b[A-Z][A-Z_0-9]+\b/,
		className: "variable.constant"
	};
	function fe(x) {
		return e.concat("(?!", x.join("|"), ")");
	}
	const oe = {
		match: e.concat(
			/\b/,
			fe([
				...kr,
				"super",
				"import"
			]),
			r,
			e.lookahead(/\(/)
		),
		className: "title.function",
		relevance: 0
	}, b = {
		begin: e.concat(/\./, e.lookahead(
			e.concat(r, /(?![0-9A-Za-z$_(])/)
		)),
		end: r,
		excludeBegin: !0,
		keywords: "prototype",
		className: "property",
		relevance: 0
	}, O = {
		match: [
			/get|set/,
			/\s+/,
			r,
			/(?=\()/
		],
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [
			{
				// eat to avoid empty params
				begin: /\(\)/
			},
			_
		]
	}, N = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + n.UNDERSCORE_IDENT_RE + ")\\s*=>", d = {
		match: [
			/const|var|let/,
			/\s+/,
			r,
			/\s*/,
			/=\s*/,
			/(async\s*)?/,
			// async is optional
			e.lookahead(N)
		],
		keywords: "async",
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [
			_
		]
	};
	return {
		name: "JavaScript",
		aliases: ["js", "jsx", "mjs", "cjs"],
		keywords: c,
		// this will be extended by TypeScript
		exports: { PARAMS_CONTAINS: q, CLASS_REFERENCE: $ },
		illegal: /#(?![$_A-z])/,
		contains: [
			n.SHEBANG({
				label: "shebang",
				binary: "node",
				relevance: 5
			}),
			G,
			n.APOS_STRING_MODE,
			n.QUOTE_STRING_MODE,
			p,
			g,
			k,
			A,
			m,
			// Skip numbers when they are part of a variable name
			{ match: /\$\d+/ },
			h,
			$,
			{
				className: "attr",
				begin: r + e.lookahead(":"),
				relevance: 0
			},
			d,
			{
				// "value" container
				begin: "(" + n.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
				keywords: "return throw case",
				relevance: 0,
				contains: [
					m,
					n.REGEXP_MODE,
					{
						className: "function",
						// we have to count the parens to make sure we actually have the
						// correct bounding ( ) before the =>.  There could be any number of
						// sub-expressions inside also surrounded by parens.
						begin: N,
						returnBegin: !0,
						end: "\\s*=>",
						contains: [
							{
								className: "params",
								variants: [
									{
										begin: n.UNDERSCORE_IDENT_RE,
										relevance: 0
									},
									{
										className: null,
										begin: /\(\s*\)/,
										skip: !0
									},
									{
										begin: /\(/,
										end: /\)/,
										excludeBegin: !0,
										excludeEnd: !0,
										keywords: c,
										contains: q
									}
								]
							}
						]
					},
					{
						// could be a comma delimited list of params to a function call
						begin: /,/,
						relevance: 0
					},
					{
						match: /\s+/,
						relevance: 0
					},
					{
						// JSX
						variants: [
							{ begin: o.begin, end: o.end },
							{ match: s },
							{
								begin: i.begin,
								// we carefully check the opening tag to see if it truly
								// is a tag and not a false positive
								"on:begin": i.isTrulyOpeningTag,
								end: i.end
							}
						],
						subLanguage: "xml",
						contains: [
							{
								begin: i.begin,
								end: i.end,
								skip: !0,
								contains: ["self"]
							}
						]
					}
				]
			},
			R,
			{
				// prevent this from getting swallowed up by function
				// since they appear "function like"
				beginKeywords: "while if switch catch for"
			},
			{
				// we have to count the parens to make sure we actually have the correct
				// bounding ( ).  There could be any number of sub-expressions inside
				// also surrounded by parens.
				begin: "\\b(?!function)" + n.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
				// end parens
				returnBegin: !0,
				label: "func.def",
				contains: [
					_,
					n.inherit(n.TITLE_MODE, { begin: r, className: "title.function" })
				]
			},
			// catch ... so it won't trigger the property rule below
			{
				match: /\.\.\./,
				relevance: 0
			},
			b,
			// hack: prevents detection of keywords in some circumstances
			// .keyword()
			// $keyword = x
			{
				match: "\\$" + r,
				relevance: 0
			},
			{
				match: [/\bconstructor(?=\s*\()/],
				className: { 1: "title.function" },
				contains: [_]
			},
			oe,
			P,
			M,
			O,
			{
				match: /\$[(.]/
				// relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
			}
		]
	};
}
const vr = (n, e) => {
	const t = n.__vccOpts || n;
	for (const [r, o] of e)
		t[r] = o;
	return t;
}, ls = {}, us = { class: "chat-button" };
function fs(n, e) {
	return I(), H("button", us, [
		Ie(n.$slots, "default")
	]);
}
const ps = /* @__PURE__ */ vr(ls, [["render", fs]]);
function hs() {
	const n = /* @__PURE__ */ new Map();
	function e(o, s) {
		const i = n.get(o);
		i && i.splice(i.indexOf(s) >>> 0, 1);
	}
	function t(o, s) {
		let i = n.get(o);
		return i ? i.push(s) : i = [s], n.set(o, i), () => e(o, s);
	}
	function r(o, s) {
		const i = n.get(o);
		i && i.slice().forEach(async (c) => {
			await c(s);
		});
	}
	return {
		on: t,
		off: e,
		emit: r
	};
}
function ds(n) {
	if (!document.querySelector(n)) {
		const t = document.createElement("div");
		n.startsWith("#") && (t.id = n.replace("#", "")), n.startsWith(".") && t.classList.add(n.replace(".", "")), document.body.appendChild(t);
	}
}
const xe = hs(), gs = { class: "chat-layout" }, ms = {
	key: 0,
	class: "chat-header"
}, bs = {
	key: 2,
	class: "chat-footer"
}, _s = /* @__PURE__ */ te({
	__name: "Layout",
	setup(n) {
		const e = Ce(null);
		function t() {
			const r = e.value;
			r && (r.scrollTop = r.scrollHeight);
		}
		return Fn(() => {
			xe.on("scrollToBottom", t), window.addEventListener("resize", t);
		}), no(() => {
			xe.off("scrollToBottom", t), window.removeEventListener("resize", t);
		}), (r, o) => (I(), H("main", gs, [
			r.$slots.header ? (I(), H("div", ms, [
				Ie(r.$slots, "header")
			])) : Fe("", !0),
			r.$slots.default ? (I(), H("div", {
				key: 1,
				ref_key: "chatBodyRef",
				ref: e,
				class: "chat-body"
			}, [
				Ie(r.$slots, "default")
			], 512)) : Fe("", !0),
			r.$slots.footer ? (I(), H("div", bs, [
				Ie(r.$slots, "footer")
			])) : Fe("", !0)
		]));
	}
}), Me = {
	webhookUrl: "http://localhost:5678",
	webhookConfig: {
		method: "POST",
		headers: {}
	},
	target: "#n8n-chat",
	mode: "window",
	loadPreviousSession: !0,
	chatInputKey: "chatInput",
	chatSessionKey: "sessionId",
	defaultLanguage: "en",
	showWelcomeScreen: !1,
	initialMessages: ["Hi there! 👋", "My name is Nathan. How can I assist you today?"],
	i18n: {
		en: {
			title: "Hi there! 👋",
			subtitle: "Start a chat. We're here to help you 24/7.",
			footer: "",
			getStarted: "New Conversation",
			inputPlaceholder: "Type your question.."
		}
	},
	theme: {}
}, ks = "#n8n-chat", vs = "n8n-chat", gt = `${vs}/sessionId`, xr = "Chat", yr = "ChatOptions";
function $n() {
	return er(xr);
}
function Un() {
	return {
		options: er(yr)
	};
}
function on() {
	const { options: n } = Un(), e = (n == null ? void 0 : n.defaultLanguage) ?? "en";
	function t(o) {
		var s, i;
		return ((i = (s = n == null ? void 0 : n.i18n) == null ? void 0 : s[e]) == null ? void 0 : i[o]) ?? o;
	}
	function r(o) {
		var s, i;
		return !!((i = (s = n == null ? void 0 : n.i18n) == null ? void 0 : s[e]) != null && i[o]);
	}
	return { t, te: r };
}
const xs = { class: "chat-get-started" }, ys = /* @__PURE__ */ te({
	__name: "GetStarted",
	setup(n) {
		const { t: e } = on();
		return (t, r) => (I(), H("div", xs, [
			_e(ps, {
				onClick: r[0] || (r[0] = (o) => t.$emit("click:button"))
			}, {
				default: ke(() => [
					nr(Xe(V(e)("getStarted")), 1)
				]),
				_: 1
			})
		]));
	}
}), ws = {}, Es = { class: "chat-powered-by" }, As = /* @__PURE__ */ J("a", { href: "https://n8n.io?utm_source=n8n-external&utm_medium=widget-powered-by" }, "n8n", -1);
function Cs(n, e) {
	return I(), H("div", Es, [
		nr(" Powered by "),
		As
	]);
}
const Ss = /* @__PURE__ */ vr(ws, [["render", Cs]]), Ds = { class: "chat-get-started-footer" }, qs = { key: 0 }, Ts = /* @__PURE__ */ te({
	__name: "GetStartedFooter",
	setup(n) {
		const { t: e, te: t } = on();
		return (r, o) => (I(), H("div", Ds, [
			V(t)("footer") ? (I(), H("div", qs, Xe(V(e)("footer")), 1)) : Fe("", !0),
			_e(Ss)
		]));
	}
});
var F = {};
const Rs = "Á", Ns = "á", Ms = "Ă", Ls = "ă", Is = "∾", Fs = "∿", Os = "∾̳", Bs = "Â", Ps = "â", zs = "´", $s = "А", Us = "а", Vs = "Æ", Hs = "æ", Gs = "⁡", js = "𝔄", Zs = "𝔞", Ws = "À", Ks = "à", Js = "ℵ", Ys = "ℵ", Xs = "Α", Qs = "α", ec = "Ā", nc = "ā", tc = "⨿", rc = "&", oc = "&", sc = "⩕", cc = "⩓", ic = "∧", ac = "⩜", lc = "⩘", uc = "⩚", fc = "∠", pc = "⦤", hc = "∠", dc = "⦨", gc = "⦩", mc = "⦪", bc = "⦫", _c = "⦬", kc = "⦭", vc = "⦮", xc = "⦯", yc = "∡", wc = "∟", Ec = "⊾", Ac = "⦝", Cc = "∢", Sc = "Å", Dc = "⍼", qc = "Ą", Tc = "ą", Rc = "𝔸", Nc = "𝕒", Mc = "⩯", Lc = "≈", Ic = "⩰", Fc = "≊", Oc = "≋", Bc = "'", Pc = "⁡", zc = "≈", $c = "≊", Uc = "Å", Vc = "å", Hc = "𝒜", Gc = "𝒶", jc = "≔", Zc = "*", Wc = "≈", Kc = "≍", Jc = "Ã", Yc = "ã", Xc = "Ä", Qc = "ä", ei = "∳", ni = "⨑", ti = "≌", ri = "϶", oi = "‵", si = "∽", ci = "⋍", ii = "∖", ai = "⫧", li = "⊽", ui = "⌅", fi = "⌆", pi = "⌅", hi = "⎵", di = "⎶", gi = "≌", mi = "Б", bi = "б", _i = "„", ki = "∵", vi = "∵", xi = "∵", yi = "⦰", wi = "϶", Ei = "ℬ", Ai = "ℬ", Ci = "Β", Si = "β", Di = "ℶ", qi = "≬", Ti = "𝔅", Ri = "𝔟", Ni = "⋂", Mi = "◯", Li = "⋃", Ii = "⨀", Fi = "⨁", Oi = "⨂", Bi = "⨆", Pi = "★", zi = "▽", $i = "△", Ui = "⨄", Vi = "⋁", Hi = "⋀", Gi = "⤍", ji = "⧫", Zi = "▪", Wi = "▴", Ki = "▾", Ji = "◂", Yi = "▸", Xi = "␣", Qi = "▒", ea = "░", na = "▓", ta = "█", ra = "=⃥", oa = "≡⃥", sa = "⫭", ca = "⌐", ia = "𝔹", aa = "𝕓", la = "⊥", ua = "⊥", fa = "⋈", pa = "⧉", ha = "┐", da = "╕", ga = "╖", ma = "╗", ba = "┌", _a = "╒", ka = "╓", va = "╔", xa = "─", ya = "═", wa = "┬", Ea = "╤", Aa = "╥", Ca = "╦", Sa = "┴", Da = "╧", qa = "╨", Ta = "╩", Ra = "⊟", Na = "⊞", Ma = "⊠", La = "┘", Ia = "╛", Fa = "╜", Oa = "╝", Ba = "└", Pa = "╘", za = "╙", $a = "╚", Ua = "│", Va = "║", Ha = "┼", Ga = "╪", ja = "╫", Za = "╬", Wa = "┤", Ka = "╡", Ja = "╢", Ya = "╣", Xa = "├", Qa = "╞", el = "╟", nl = "╠", tl = "‵", rl = "˘", ol = "˘", sl = "¦", cl = "𝒷", il = "ℬ", al = "⁏", ll = "∽", ul = "⋍", fl = "⧅", pl = "\\", hl = "⟈", dl = "•", gl = "•", ml = "≎", bl = "⪮", _l = "≏", kl = "≎", vl = "≏", xl = "Ć", yl = "ć", wl = "⩄", El = "⩉", Al = "⩋", Cl = "∩", Sl = "⋒", Dl = "⩇", ql = "⩀", Tl = "ⅅ", Rl = "∩︀", Nl = "⁁", Ml = "ˇ", Ll = "ℭ", Il = "⩍", Fl = "Č", Ol = "č", Bl = "Ç", Pl = "ç", zl = "Ĉ", $l = "ĉ", Ul = "∰", Vl = "⩌", Hl = "⩐", Gl = "Ċ", jl = "ċ", Zl = "¸", Wl = "¸", Kl = "⦲", Jl = "¢", Yl = "·", Xl = "·", Ql = "𝔠", eu = "ℭ", nu = "Ч", tu = "ч", ru = "✓", ou = "✓", su = "Χ", cu = "χ", iu = "ˆ", au = "≗", lu = "↺", uu = "↻", fu = "⊛", pu = "⊚", hu = "⊝", du = "⊙", gu = "®", mu = "Ⓢ", bu = "⊖", _u = "⊕", ku = "⊗", vu = "○", xu = "⧃", yu = "≗", wu = "⨐", Eu = "⫯", Au = "⧂", Cu = "∲", Su = "”", Du = "’", qu = "♣", Tu = "♣", Ru = ":", Nu = "∷", Mu = "⩴", Lu = "≔", Iu = "≔", Fu = ",", Ou = "@", Bu = "∁", Pu = "∘", zu = "∁", $u = "ℂ", Uu = "≅", Vu = "⩭", Hu = "≡", Gu = "∮", ju = "∯", Zu = "∮", Wu = "𝕔", Ku = "ℂ", Ju = "∐", Yu = "∐", Xu = "©", Qu = "©", ef = "℗", nf = "∳", tf = "↵", rf = "✗", of = "⨯", sf = "𝒞", cf = "𝒸", af = "⫏", lf = "⫑", uf = "⫐", ff = "⫒", pf = "⋯", hf = "⤸", df = "⤵", gf = "⋞", mf = "⋟", bf = "↶", _f = "⤽", kf = "⩈", vf = "⩆", xf = "≍", yf = "∪", wf = "⋓", Ef = "⩊", Af = "⊍", Cf = "⩅", Sf = "∪︀", Df = "↷", qf = "⤼", Tf = "⋞", Rf = "⋟", Nf = "⋎", Mf = "⋏", Lf = "¤", If = "↶", Ff = "↷", Of = "⋎", Bf = "⋏", Pf = "∲", zf = "∱", $f = "⌭", Uf = "†", Vf = "‡", Hf = "ℸ", Gf = "↓", jf = "↡", Zf = "⇓", Wf = "‐", Kf = "⫤", Jf = "⊣", Yf = "⤏", Xf = "˝", Qf = "Ď", ep = "ď", np = "Д", tp = "д", rp = "‡", op = "⇊", sp = "ⅅ", cp = "ⅆ", ip = "⤑", ap = "⩷", lp = "°", up = "∇", fp = "Δ", pp = "δ", hp = "⦱", dp = "⥿", gp = "𝔇", mp = "𝔡", bp = "⥥", _p = "⇃", kp = "⇂", vp = "´", xp = "˙", yp = "˝", wp = "`", Ep = "˜", Ap = "⋄", Cp = "⋄", Sp = "⋄", Dp = "♦", qp = "♦", Tp = "¨", Rp = "ⅆ", Np = "ϝ", Mp = "⋲", Lp = "÷", Ip = "÷", Fp = "⋇", Op = "⋇", Bp = "Ђ", Pp = "ђ", zp = "⌞", $p = "⌍", Up = "$", Vp = "𝔻", Hp = "𝕕", Gp = "¨", jp = "˙", Zp = "⃜", Wp = "≐", Kp = "≑", Jp = "≐", Yp = "∸", Xp = "∔", Qp = "⊡", eh = "⌆", nh = "∯", th = "¨", rh = "⇓", oh = "⇐", sh = "⇔", ch = "⫤", ih = "⟸", ah = "⟺", lh = "⟹", uh = "⇒", fh = "⊨", ph = "⇑", hh = "⇕", dh = "∥", gh = "⤓", mh = "↓", bh = "↓", _h = "⇓", kh = "⇵", vh = "̑", xh = "⇊", yh = "⇃", wh = "⇂", Eh = "⥐", Ah = "⥞", Ch = "⥖", Sh = "↽", Dh = "⥟", qh = "⥗", Th = "⇁", Rh = "↧", Nh = "⊤", Mh = "⤐", Lh = "⌟", Ih = "⌌", Fh = "𝒟", Oh = "𝒹", Bh = "Ѕ", Ph = "ѕ", zh = "⧶", $h = "Đ", Uh = "đ", Vh = "⋱", Hh = "▿", Gh = "▾", jh = "⇵", Zh = "⥯", Wh = "⦦", Kh = "Џ", Jh = "џ", Yh = "⟿", Xh = "É", Qh = "é", ed = "⩮", nd = "Ě", td = "ě", rd = "Ê", od = "ê", sd = "≖", cd = "≕", id = "Э", ad = "э", ld = "⩷", ud = "Ė", fd = "ė", pd = "≑", hd = "ⅇ", dd = "≒", gd = "𝔈", md = "𝔢", bd = "⪚", _d = "È", kd = "è", vd = "⪖", xd = "⪘", yd = "⪙", wd = "∈", Ed = "⏧", Ad = "ℓ", Cd = "⪕", Sd = "⪗", Dd = "Ē", qd = "ē", Td = "∅", Rd = "∅", Nd = "◻", Md = "∅", Ld = "▫", Id = " ", Fd = " ", Od = " ", Bd = "Ŋ", Pd = "ŋ", zd = " ", $d = "Ę", Ud = "ę", Vd = "𝔼", Hd = "𝕖", Gd = "⋕", jd = "⧣", Zd = "⩱", Wd = "ε", Kd = "Ε", Jd = "ε", Yd = "ϵ", Xd = "≖", Qd = "≕", eg = "≂", ng = "⪖", tg = "⪕", rg = "⩵", og = "=", sg = "≂", cg = "≟", ig = "⇌", ag = "≡", lg = "⩸", ug = "⧥", fg = "⥱", pg = "≓", hg = "ℯ", dg = "ℰ", gg = "≐", mg = "⩳", bg = "≂", _g = "Η", kg = "η", vg = "Ð", xg = "ð", yg = "Ë", wg = "ë", Eg = "€", Ag = "!", Cg = "∃", Sg = "∃", Dg = "ℰ", qg = "ⅇ", Tg = "ⅇ", Rg = "≒", Ng = "Ф", Mg = "ф", Lg = "♀", Ig = "ﬃ", Fg = "ﬀ", Og = "ﬄ", Bg = "𝔉", Pg = "𝔣", zg = "ﬁ", $g = "◼", Ug = "▪", Vg = "fj", Hg = "♭", Gg = "ﬂ", jg = "▱", Zg = "ƒ", Wg = "𝔽", Kg = "𝕗", Jg = "∀", Yg = "∀", Xg = "⋔", Qg = "⫙", em = "ℱ", nm = "⨍", tm = "½", rm = "⅓", om = "¼", sm = "⅕", cm = "⅙", im = "⅛", am = "⅔", lm = "⅖", um = "¾", fm = "⅗", pm = "⅜", hm = "⅘", dm = "⅚", gm = "⅝", mm = "⅞", bm = "⁄", _m = "⌢", km = "𝒻", vm = "ℱ", xm = "ǵ", ym = "Γ", wm = "γ", Em = "Ϝ", Am = "ϝ", Cm = "⪆", Sm = "Ğ", Dm = "ğ", qm = "Ģ", Tm = "Ĝ", Rm = "ĝ", Nm = "Г", Mm = "г", Lm = "Ġ", Im = "ġ", Fm = "≥", Om = "≧", Bm = "⪌", Pm = "⋛", zm = "≥", $m = "≧", Um = "⩾", Vm = "⪩", Hm = "⩾", Gm = "⪀", jm = "⪂", Zm = "⪄", Wm = "⋛︀", Km = "⪔", Jm = "𝔊", Ym = "𝔤", Xm = "≫", Qm = "⋙", eb = "⋙", nb = "ℷ", tb = "Ѓ", rb = "ѓ", ob = "⪥", sb = "≷", cb = "⪒", ib = "⪤", ab = "⪊", lb = "⪊", ub = "⪈", fb = "≩", pb = "⪈", hb = "≩", db = "⋧", gb = "𝔾", mb = "𝕘", bb = "`", _b = "≥", kb = "⋛", vb = "≧", xb = "⪢", yb = "≷", wb = "⩾", Eb = "≳", Ab = "𝒢", Cb = "ℊ", Sb = "≳", Db = "⪎", qb = "⪐", Tb = "⪧", Rb = "⩺", Nb = ">", Mb = ">", Lb = "≫", Ib = "⋗", Fb = "⦕", Ob = "⩼", Bb = "⪆", Pb = "⥸", zb = "⋗", $b = "⋛", Ub = "⪌", Vb = "≷", Hb = "≳", Gb = "≩︀", jb = "≩︀", Zb = "ˇ", Wb = " ", Kb = "½", Jb = "ℋ", Yb = "Ъ", Xb = "ъ", Qb = "⥈", e_ = "↔", n_ = "⇔", t_ = "↭", r_ = "^", o_ = "ℏ", s_ = "Ĥ", c_ = "ĥ", i_ = "♥", a_ = "♥", l_ = "…", u_ = "⊹", f_ = "𝔥", p_ = "ℌ", h_ = "ℋ", d_ = "⤥", g_ = "⤦", m_ = "⇿", b_ = "∻", __ = "↩", k_ = "↪", v_ = "𝕙", x_ = "ℍ", y_ = "―", w_ = "─", E_ = "𝒽", A_ = "ℋ", C_ = "ℏ", S_ = "Ħ", D_ = "ħ", q_ = "≎", T_ = "≏", R_ = "⁃", N_ = "‐", M_ = "Í", L_ = "í", I_ = "⁣", F_ = "Î", O_ = "î", B_ = "И", P_ = "и", z_ = "İ", $_ = "Е", U_ = "е", V_ = "¡", H_ = "⇔", G_ = "𝔦", j_ = "ℑ", Z_ = "Ì", W_ = "ì", K_ = "ⅈ", J_ = "⨌", Y_ = "∭", X_ = "⧜", Q_ = "℩", e0 = "Ĳ", n0 = "ĳ", t0 = "Ī", r0 = "ī", o0 = "ℑ", s0 = "ⅈ", c0 = "ℐ", i0 = "ℑ", a0 = "ı", l0 = "ℑ", u0 = "⊷", f0 = "Ƶ", p0 = "⇒", h0 = "℅", d0 = "∞", g0 = "⧝", m0 = "ı", b0 = "⊺", _0 = "∫", k0 = "∬", v0 = "ℤ", x0 = "∫", y0 = "⊺", w0 = "⋂", E0 = "⨗", A0 = "⨼", C0 = "⁣", S0 = "⁢", D0 = "Ё", q0 = "ё", T0 = "Į", R0 = "į", N0 = "𝕀", M0 = "𝕚", L0 = "Ι", I0 = "ι", F0 = "⨼", O0 = "¿", B0 = "𝒾", P0 = "ℐ", z0 = "∈", $0 = "⋵", U0 = "⋹", V0 = "⋴", H0 = "⋳", G0 = "∈", j0 = "⁢", Z0 = "Ĩ", W0 = "ĩ", K0 = "І", J0 = "і", Y0 = "Ï", X0 = "ï", Q0 = "Ĵ", ek = "ĵ", nk = "Й", tk = "й", rk = "𝔍", ok = "𝔧", sk = "ȷ", ck = "𝕁", ik = "𝕛", ak = "𝒥", lk = "𝒿", uk = "Ј", fk = "ј", pk = "Є", hk = "є", dk = "Κ", gk = "κ", mk = "ϰ", bk = "Ķ", _k = "ķ", kk = "К", vk = "к", xk = "𝔎", yk = "𝔨", wk = "ĸ", Ek = "Х", Ak = "х", Ck = "Ќ", Sk = "ќ", Dk = "𝕂", qk = "𝕜", Tk = "𝒦", Rk = "𝓀", Nk = "⇚", Mk = "Ĺ", Lk = "ĺ", Ik = "⦴", Fk = "ℒ", Ok = "Λ", Bk = "λ", Pk = "⟨", zk = "⟪", $k = "⦑", Uk = "⟨", Vk = "⪅", Hk = "ℒ", Gk = "«", jk = "⇤", Zk = "⤟", Wk = "←", Kk = "↞", Jk = "⇐", Yk = "⤝", Xk = "↩", Qk = "↫", ev = "⤹", nv = "⥳", tv = "↢", rv = "⤙", ov = "⤛", sv = "⪫", cv = "⪭", iv = "⪭︀", av = "⤌", lv = "⤎", uv = "❲", fv = "{", pv = "[", hv = "⦋", dv = "⦏", gv = "⦍", mv = "Ľ", bv = "ľ", _v = "Ļ", kv = "ļ", vv = "⌈", xv = "{", yv = "Л", wv = "л", Ev = "⤶", Av = "“", Cv = "„", Sv = "⥧", Dv = "⥋", qv = "↲", Tv = "≤", Rv = "≦", Nv = "⟨", Mv = "⇤", Lv = "←", Iv = "←", Fv = "⇐", Ov = "⇆", Bv = "↢", Pv = "⌈", zv = "⟦", $v = "⥡", Uv = "⥙", Vv = "⇃", Hv = "⌊", Gv = "↽", jv = "↼", Zv = "⇇", Wv = "↔", Kv = "↔", Jv = "⇔", Yv = "⇆", Xv = "⇋", Qv = "↭", ex = "⥎", nx = "↤", tx = "⊣", rx = "⥚", ox = "⋋", sx = "⧏", cx = "⊲", ix = "⊴", ax = "⥑", lx = "⥠", ux = "⥘", fx = "↿", px = "⥒", hx = "↼", dx = "⪋", gx = "⋚", mx = "≤", bx = "≦", _x = "⩽", kx = "⪨", vx = "⩽", xx = "⩿", yx = "⪁", wx = "⪃", Ex = "⋚︀", Ax = "⪓", Cx = "⪅", Sx = "⋖", Dx = "⋚", qx = "⪋", Tx = "⋚", Rx = "≦", Nx = "≶", Mx = "≶", Lx = "⪡", Ix = "≲", Fx = "⩽", Ox = "≲", Bx = "⥼", Px = "⌊", zx = "𝔏", $x = "𝔩", Ux = "≶", Vx = "⪑", Hx = "⥢", Gx = "↽", jx = "↼", Zx = "⥪", Wx = "▄", Kx = "Љ", Jx = "љ", Yx = "⇇", Xx = "≪", Qx = "⋘", ey = "⌞", ny = "⇚", ty = "⥫", ry = "◺", oy = "Ŀ", sy = "ŀ", cy = "⎰", iy = "⎰", ay = "⪉", ly = "⪉", uy = "⪇", fy = "≨", py = "⪇", hy = "≨", dy = "⋦", gy = "⟬", my = "⇽", by = "⟦", _y = "⟵", ky = "⟵", vy = "⟸", xy = "⟷", yy = "⟷", wy = "⟺", Ey = "⟼", Ay = "⟶", Cy = "⟶", Sy = "⟹", Dy = "↫", qy = "↬", Ty = "⦅", Ry = "𝕃", Ny = "𝕝", My = "⨭", Ly = "⨴", Iy = "∗", Fy = "_", Oy = "↙", By = "↘", Py = "◊", zy = "◊", $y = "⧫", Uy = "(", Vy = "⦓", Hy = "⇆", Gy = "⌟", jy = "⇋", Zy = "⥭", Wy = "‎", Ky = "⊿", Jy = "‹", Yy = "𝓁", Xy = "ℒ", Qy = "↰", ew = "↰", nw = "≲", tw = "⪍", rw = "⪏", ow = "[", sw = "‘", cw = "‚", iw = "Ł", aw = "ł", lw = "⪦", uw = "⩹", fw = "<", pw = "<", hw = "≪", dw = "⋖", gw = "⋋", mw = "⋉", bw = "⥶", _w = "⩻", kw = "◃", vw = "⊴", xw = "◂", yw = "⦖", ww = "⥊", Ew = "⥦", Aw = "≨︀", Cw = "≨︀", Sw = "¯", Dw = "♂", qw = "✠", Tw = "✠", Rw = "↦", Nw = "↦", Mw = "↧", Lw = "↤", Iw = "↥", Fw = "▮", Ow = "⨩", Bw = "М", Pw = "м", zw = "—", $w = "∺", Uw = "∡", Vw = " ", Hw = "ℳ", Gw = "𝔐", jw = "𝔪", Zw = "℧", Ww = "µ", Kw = "*", Jw = "⫰", Yw = "∣", Xw = "·", Qw = "⊟", eE = "−", nE = "∸", tE = "⨪", rE = "∓", oE = "⫛", sE = "…", cE = "∓", iE = "⊧", aE = "𝕄", lE = "𝕞", uE = "∓", fE = "𝓂", pE = "ℳ", hE = "∾", dE = "Μ", gE = "μ", mE = "⊸", bE = "⊸", _E = "∇", kE = "Ń", vE = "ń", xE = "∠⃒", yE = "≉", wE = "⩰̸", EE = "≋̸", AE = "ŉ", CE = "≉", SE = "♮", DE = "ℕ", qE = "♮", TE = " ", RE = "≎̸", NE = "≏̸", ME = "⩃", LE = "Ň", IE = "ň", FE = "Ņ", OE = "ņ", BE = "≇", PE = "⩭̸", zE = "⩂", $E = "Н", UE = "н", VE = "–", HE = "⤤", GE = "↗", jE = "⇗", ZE = "↗", WE = "≠", KE = "≐̸", JE = "​", YE = "​", XE = "​", QE = "​", eA = "≢", nA = "⤨", tA = "≂̸", rA = "≫", oA = "≪", sA = `
`, cA = "∄", iA = "∄", aA = "𝔑", lA = "𝔫", uA = "≧̸", fA = "≱", pA = "≱", hA = "≧̸", dA = "⩾̸", gA = "⩾̸", mA = "⋙̸", bA = "≵", _A = "≫⃒", kA = "≯", vA = "≯", xA = "≫̸", yA = "↮", wA = "⇎", EA = "⫲", AA = "∋", CA = "⋼", SA = "⋺", DA = "∋", qA = "Њ", TA = "њ", RA = "↚", NA = "⇍", MA = "‥", LA = "≦̸", IA = "≰", FA = "↚", OA = "⇍", BA = "↮", PA = "⇎", zA = "≰", $A = "≦̸", UA = "⩽̸", VA = "⩽̸", HA = "≮", GA = "⋘̸", jA = "≴", ZA = "≪⃒", WA = "≮", KA = "⋪", JA = "⋬", YA = "≪̸", XA = "∤", QA = "⁠", eC = " ", nC = "𝕟", tC = "ℕ", rC = "⫬", oC = "¬", sC = "≢", cC = "≭", iC = "∦", aC = "∉", lC = "≠", uC = "≂̸", fC = "∄", pC = "≯", hC = "≱", dC = "≧̸", gC = "≫̸", mC = "≹", bC = "⩾̸", _C = "≵", kC = "≎̸", vC = "≏̸", xC = "∉", yC = "⋵̸", wC = "⋹̸", EC = "∉", AC = "⋷", CC = "⋶", SC = "⧏̸", DC = "⋪", qC = "⋬", TC = "≮", RC = "≰", NC = "≸", MC = "≪̸", LC = "⩽̸", IC = "≴", FC = "⪢̸", OC = "⪡̸", BC = "∌", PC = "∌", zC = "⋾", $C = "⋽", UC = "⊀", VC = "⪯̸", HC = "⋠", GC = "∌", jC = "⧐̸", ZC = "⋫", WC = "⋭", KC = "⊏̸", JC = "⋢", YC = "⊐̸", XC = "⋣", QC = "⊂⃒", e1 = "⊈", n1 = "⊁", t1 = "⪰̸", r1 = "⋡", o1 = "≿̸", s1 = "⊃⃒", c1 = "⊉", i1 = "≁", a1 = "≄", l1 = "≇", u1 = "≉", f1 = "∤", p1 = "∦", h1 = "∦", d1 = "⫽⃥", g1 = "∂̸", m1 = "⨔", b1 = "⊀", _1 = "⋠", k1 = "⊀", v1 = "⪯̸", x1 = "⪯̸", y1 = "⤳̸", w1 = "↛", E1 = "⇏", A1 = "↝̸", C1 = "↛", S1 = "⇏", D1 = "⋫", q1 = "⋭", T1 = "⊁", R1 = "⋡", N1 = "⪰̸", M1 = "𝒩", L1 = "𝓃", I1 = "∤", F1 = "∦", O1 = "≁", B1 = "≄", P1 = "≄", z1 = "∤", $1 = "∦", U1 = "⋢", V1 = "⋣", H1 = "⊄", G1 = "⫅̸", j1 = "⊈", Z1 = "⊂⃒", W1 = "⊈", K1 = "⫅̸", J1 = "⊁", Y1 = "⪰̸", X1 = "⊅", Q1 = "⫆̸", eS = "⊉", nS = "⊃⃒", tS = "⊉", rS = "⫆̸", oS = "≹", sS = "Ñ", cS = "ñ", iS = "≸", aS = "⋪", lS = "⋬", uS = "⋫", fS = "⋭", pS = "Ν", hS = "ν", dS = "#", gS = "№", mS = " ", bS = "≍⃒", _S = "⊬", kS = "⊭", vS = "⊮", xS = "⊯", yS = "≥⃒", wS = ">⃒", ES = "⤄", AS = "⧞", CS = "⤂", SS = "≤⃒", DS = "<⃒", qS = "⊴⃒", TS = "⤃", RS = "⊵⃒", NS = "∼⃒", MS = "⤣", LS = "↖", IS = "⇖", FS = "↖", OS = "⤧", BS = "Ó", PS = "ó", zS = "⊛", $S = "Ô", US = "ô", VS = "⊚", HS = "О", GS = "о", jS = "⊝", ZS = "Ő", WS = "ő", KS = "⨸", JS = "⊙", YS = "⦼", XS = "Œ", QS = "œ", eD = "⦿", nD = "𝔒", tD = "𝔬", rD = "˛", oD = "Ò", sD = "ò", cD = "⧁", iD = "⦵", aD = "Ω", lD = "∮", uD = "↺", fD = "⦾", pD = "⦻", hD = "‾", dD = "⧀", gD = "Ō", mD = "ō", bD = "Ω", _D = "ω", kD = "Ο", vD = "ο", xD = "⦶", yD = "⊖", wD = "𝕆", ED = "𝕠", AD = "⦷", CD = "“", SD = "‘", DD = "⦹", qD = "⊕", TD = "↻", RD = "⩔", ND = "∨", MD = "⩝", LD = "ℴ", ID = "ℴ", FD = "ª", OD = "º", BD = "⊶", PD = "⩖", zD = "⩗", $D = "⩛", UD = "Ⓢ", VD = "𝒪", HD = "ℴ", GD = "Ø", jD = "ø", ZD = "⊘", WD = "Õ", KD = "õ", JD = "⨶", YD = "⨷", XD = "⊗", QD = "Ö", eq = "ö", nq = "⌽", tq = "‾", rq = "⏞", oq = "⎴", sq = "⏜", cq = "¶", iq = "∥", aq = "∥", lq = "⫳", uq = "⫽", fq = "∂", pq = "∂", hq = "П", dq = "п", gq = "%", mq = ".", bq = "‰", _q = "⊥", kq = "‱", vq = "𝔓", xq = "𝔭", yq = "Φ", wq = "φ", Eq = "ϕ", Aq = "ℳ", Cq = "☎", Sq = "Π", Dq = "π", qq = "⋔", Tq = "ϖ", Rq = "ℏ", Nq = "ℎ", Mq = "ℏ", Lq = "⨣", Iq = "⊞", Fq = "⨢", Oq = "+", Bq = "∔", Pq = "⨥", zq = "⩲", $q = "±", Uq = "±", Vq = "⨦", Hq = "⨧", Gq = "±", jq = "ℌ", Zq = "⨕", Wq = "𝕡", Kq = "ℙ", Jq = "£", Yq = "⪷", Xq = "⪻", Qq = "≺", eT = "≼", nT = "⪷", tT = "≺", rT = "≼", oT = "≺", sT = "⪯", cT = "≼", iT = "≾", aT = "⪯", lT = "⪹", uT = "⪵", fT = "⋨", pT = "⪯", hT = "⪳", dT = "≾", gT = "′", mT = "″", bT = "ℙ", _T = "⪹", kT = "⪵", vT = "⋨", xT = "∏", yT = "∏", wT = "⌮", ET = "⌒", AT = "⌓", CT = "∝", ST = "∝", DT = "∷", qT = "∝", TT = "≾", RT = "⊰", NT = "𝒫", MT = "𝓅", LT = "Ψ", IT = "ψ", FT = " ", OT = "𝔔", BT = "𝔮", PT = "⨌", zT = "𝕢", $T = "ℚ", UT = "⁗", VT = "𝒬", HT = "𝓆", GT = "ℍ", jT = "⨖", ZT = "?", WT = "≟", KT = '"', JT = '"', YT = "⇛", XT = "∽̱", QT = "Ŕ", eR = "ŕ", nR = "√", tR = "⦳", rR = "⟩", oR = "⟫", sR = "⦒", cR = "⦥", iR = "⟩", aR = "»", lR = "⥵", uR = "⇥", fR = "⤠", pR = "⤳", hR = "→", dR = "↠", gR = "⇒", mR = "⤞", bR = "↪", _R = "↬", kR = "⥅", vR = "⥴", xR = "⤖", yR = "↣", wR = "↝", ER = "⤚", AR = "⤜", CR = "∶", SR = "ℚ", DR = "⤍", qR = "⤏", TR = "⤐", RR = "❳", NR = "}", MR = "]", LR = "⦌", IR = "⦎", FR = "⦐", OR = "Ř", BR = "ř", PR = "Ŗ", zR = "ŗ", $R = "⌉", UR = "}", VR = "Р", HR = "р", GR = "⤷", jR = "⥩", ZR = "”", WR = "”", KR = "↳", JR = "ℜ", YR = "ℛ", XR = "ℜ", QR = "ℝ", eN = "ℜ", nN = "▭", tN = "®", rN = "®", oN = "∋", sN = "⇋", cN = "⥯", iN = "⥽", aN = "⌋", lN = "𝔯", uN = "ℜ", fN = "⥤", pN = "⇁", hN = "⇀", dN = "⥬", gN = "Ρ", mN = "ρ", bN = "ϱ", _N = "⟩", kN = "⇥", vN = "→", xN = "→", yN = "⇒", wN = "⇄", EN = "↣", AN = "⌉", CN = "⟧", SN = "⥝", DN = "⥕", qN = "⇂", TN = "⌋", RN = "⇁", NN = "⇀", MN = "⇄", LN = "⇌", IN = "⇉", FN = "↝", ON = "↦", BN = "⊢", PN = "⥛", zN = "⋌", $N = "⧐", UN = "⊳", VN = "⊵", HN = "⥏", GN = "⥜", jN = "⥔", ZN = "↾", WN = "⥓", KN = "⇀", JN = "˚", YN = "≓", XN = "⇄", QN = "⇌", eM = "‏", nM = "⎱", tM = "⎱", rM = "⫮", oM = "⟭", sM = "⇾", cM = "⟧", iM = "⦆", aM = "𝕣", lM = "ℝ", uM = "⨮", fM = "⨵", pM = "⥰", hM = ")", dM = "⦔", gM = "⨒", mM = "⇉", bM = "⇛", _M = "›", kM = "𝓇", vM = "ℛ", xM = "↱", yM = "↱", wM = "]", EM = "’", AM = "’", CM = "⋌", SM = "⋊", DM = "▹", qM = "⊵", TM = "▸", RM = "⧎", NM = "⧴", MM = "⥨", LM = "℞", IM = "Ś", FM = "ś", OM = "‚", BM = "⪸", PM = "Š", zM = "š", $M = "⪼", UM = "≻", VM = "≽", HM = "⪰", GM = "⪴", jM = "Ş", ZM = "ş", WM = "Ŝ", KM = "ŝ", JM = "⪺", YM = "⪶", XM = "⋩", QM = "⨓", eL = "≿", nL = "С", tL = "с", rL = "⊡", oL = "⋅", sL = "⩦", cL = "⤥", iL = "↘", aL = "⇘", lL = "↘", uL = "§", fL = ";", pL = "⤩", hL = "∖", dL = "∖", gL = "✶", mL = "𝔖", bL = "𝔰", _L = "⌢", kL = "♯", vL = "Щ", xL = "щ", yL = "Ш", wL = "ш", EL = "↓", AL = "←", CL = "∣", SL = "∥", DL = "→", qL = "↑", TL = "­", RL = "Σ", NL = "σ", ML = "ς", LL = "ς", IL = "∼", FL = "⩪", OL = "≃", BL = "≃", PL = "⪞", zL = "⪠", $L = "⪝", UL = "⪟", VL = "≆", HL = "⨤", GL = "⥲", jL = "←", ZL = "∘", WL = "∖", KL = "⨳", JL = "⧤", YL = "∣", XL = "⌣", QL = "⪪", e2 = "⪬", n2 = "⪬︀", t2 = "Ь", r2 = "ь", o2 = "⌿", s2 = "⧄", c2 = "/", i2 = "𝕊", a2 = "𝕤", l2 = "♠", u2 = "♠", f2 = "∥", p2 = "⊓", h2 = "⊓︀", d2 = "⊔", g2 = "⊔︀", m2 = "√", b2 = "⊏", _2 = "⊑", k2 = "⊏", v2 = "⊑", x2 = "⊐", y2 = "⊒", w2 = "⊐", E2 = "⊒", A2 = "□", C2 = "□", S2 = "⊓", D2 = "⊏", q2 = "⊑", T2 = "⊐", R2 = "⊒", N2 = "⊔", M2 = "▪", L2 = "□", I2 = "▪", F2 = "→", O2 = "𝒮", B2 = "𝓈", P2 = "∖", z2 = "⌣", $2 = "⋆", U2 = "⋆", V2 = "☆", H2 = "★", G2 = "ϵ", j2 = "ϕ", Z2 = "¯", W2 = "⊂", K2 = "⋐", J2 = "⪽", Y2 = "⫅", X2 = "⊆", Q2 = "⫃", eI = "⫁", nI = "⫋", tI = "⊊", rI = "⪿", oI = "⥹", sI = "⊂", cI = "⋐", iI = "⊆", aI = "⫅", lI = "⊆", uI = "⊊", fI = "⫋", pI = "⫇", hI = "⫕", dI = "⫓", gI = "⪸", mI = "≻", bI = "≽", _I = "≻", kI = "⪰", vI = "≽", xI = "≿", yI = "⪰", wI = "⪺", EI = "⪶", AI = "⋩", CI = "≿", SI = "∋", DI = "∑", qI = "∑", TI = "♪", RI = "¹", NI = "²", MI = "³", LI = "⊃", II = "⋑", FI = "⪾", OI = "⫘", BI = "⫆", PI = "⊇", zI = "⫄", $I = "⊃", UI = "⊇", VI = "⟉", HI = "⫗", GI = "⥻", jI = "⫂", ZI = "⫌", WI = "⊋", KI = "⫀", JI = "⊃", YI = "⋑", XI = "⊇", QI = "⫆", eF = "⊋", nF = "⫌", tF = "⫈", rF = "⫔", oF = "⫖", sF = "⤦", cF = "↙", iF = "⇙", aF = "↙", lF = "⤪", uF = "ß", fF = "	", pF = "⌖", hF = "Τ", dF = "τ", gF = "⎴", mF = "Ť", bF = "ť", _F = "Ţ", kF = "ţ", vF = "Т", xF = "т", yF = "⃛", wF = "⌕", EF = "𝔗", AF = "𝔱", CF = "∴", SF = "∴", DF = "∴", qF = "Θ", TF = "θ", RF = "ϑ", NF = "ϑ", MF = "≈", LF = "∼", IF = "  ", FF = " ", OF = " ", BF = "≈", PF = "∼", zF = "Þ", $F = "þ", UF = "˜", VF = "∼", HF = "≃", GF = "≅", jF = "≈", ZF = "⨱", WF = "⊠", KF = "×", JF = "⨰", YF = "∭", XF = "⤨", QF = "⌶", eO = "⫱", nO = "⊤", tO = "𝕋", rO = "𝕥", oO = "⫚", sO = "⤩", cO = "‴", iO = "™", aO = "™", lO = "▵", uO = "▿", fO = "◃", pO = "⊴", hO = "≜", dO = "▹", gO = "⊵", mO = "◬", bO = "≜", _O = "⨺", kO = "⃛", vO = "⨹", xO = "⧍", yO = "⨻", wO = "⏢", EO = "𝒯", AO = "𝓉", CO = "Ц", SO = "ц", DO = "Ћ", qO = "ћ", TO = "Ŧ", RO = "ŧ", NO = "≬", MO = "↞", LO = "↠", IO = "Ú", FO = "ú", OO = "↑", BO = "↟", PO = "⇑", zO = "⥉", $O = "Ў", UO = "ў", VO = "Ŭ", HO = "ŭ", GO = "Û", jO = "û", ZO = "У", WO = "у", KO = "⇅", JO = "Ű", YO = "ű", XO = "⥮", QO = "⥾", eB = "𝔘", nB = "𝔲", tB = "Ù", rB = "ù", oB = "⥣", sB = "↿", cB = "↾", iB = "▀", aB = "⌜", lB = "⌜", uB = "⌏", fB = "◸", pB = "Ū", hB = "ū", dB = "¨", gB = "_", mB = "⏟", bB = "⎵", _B = "⏝", kB = "⋃", vB = "⊎", xB = "Ų", yB = "ų", wB = "𝕌", EB = "𝕦", AB = "⤒", CB = "↑", SB = "↑", DB = "⇑", qB = "⇅", TB = "↕", RB = "↕", NB = "⇕", MB = "⥮", LB = "↿", IB = "↾", FB = "⊎", OB = "↖", BB = "↗", PB = "υ", zB = "ϒ", $B = "ϒ", UB = "Υ", VB = "υ", HB = "↥", GB = "⊥", jB = "⇈", ZB = "⌝", WB = "⌝", KB = "⌎", JB = "Ů", YB = "ů", XB = "◹", QB = "𝒰", eP = "𝓊", nP = "⋰", tP = "Ũ", rP = "ũ", oP = "▵", sP = "▴", cP = "⇈", iP = "Ü", aP = "ü", lP = "⦧", uP = "⦜", fP = "ϵ", pP = "ϰ", hP = "∅", dP = "ϕ", gP = "ϖ", mP = "∝", bP = "↕", _P = "⇕", kP = "ϱ", vP = "ς", xP = "⊊︀", yP = "⫋︀", wP = "⊋︀", EP = "⫌︀", AP = "ϑ", CP = "⊲", SP = "⊳", DP = "⫨", qP = "⫫", TP = "⫩", RP = "В", NP = "в", MP = "⊢", LP = "⊨", IP = "⊩", FP = "⊫", OP = "⫦", BP = "⊻", PP = "∨", zP = "⋁", $P = "≚", UP = "⋮", VP = "|", HP = "‖", GP = "|", jP = "‖", ZP = "∣", WP = "|", KP = "❘", JP = "≀", YP = " ", XP = "𝔙", QP = "𝔳", ez = "⊲", nz = "⊂⃒", tz = "⊃⃒", rz = "𝕍", oz = "𝕧", sz = "∝", cz = "⊳", iz = "𝒱", az = "𝓋", lz = "⫋︀", uz = "⊊︀", fz = "⫌︀", pz = "⊋︀", hz = "⊪", dz = "⦚", gz = "Ŵ", mz = "ŵ", bz = "⩟", _z = "∧", kz = "⋀", vz = "≙", xz = "℘", yz = "𝔚", wz = "𝔴", Ez = "𝕎", Az = "𝕨", Cz = "℘", Sz = "≀", Dz = "≀", qz = "𝒲", Tz = "𝓌", Rz = "⋂", Nz = "◯", Mz = "⋃", Lz = "▽", Iz = "𝔛", Fz = "𝔵", Oz = "⟷", Bz = "⟺", Pz = "Ξ", zz = "ξ", $z = "⟵", Uz = "⟸", Vz = "⟼", Hz = "⋻", Gz = "⨀", jz = "𝕏", Zz = "𝕩", Wz = "⨁", Kz = "⨂", Jz = "⟶", Yz = "⟹", Xz = "𝒳", Qz = "𝓍", e3 = "⨆", n3 = "⨄", t3 = "△", r3 = "⋁", o3 = "⋀", s3 = "Ý", c3 = "ý", i3 = "Я", a3 = "я", l3 = "Ŷ", u3 = "ŷ", f3 = "Ы", p3 = "ы", h3 = "¥", d3 = "𝔜", g3 = "𝔶", m3 = "Ї", b3 = "ї", _3 = "𝕐", k3 = "𝕪", v3 = "𝒴", x3 = "𝓎", y3 = "Ю", w3 = "ю", E3 = "ÿ", A3 = "Ÿ", C3 = "Ź", S3 = "ź", D3 = "Ž", q3 = "ž", T3 = "З", R3 = "з", N3 = "Ż", M3 = "ż", L3 = "ℨ", I3 = "​", F3 = "Ζ", O3 = "ζ", B3 = "𝔷", P3 = "ℨ", z3 = "Ж", $3 = "ж", U3 = "⇝", V3 = "𝕫", H3 = "ℤ", G3 = "𝒵", j3 = "𝓏", Z3 = "‍", W3 = "‌", K3 = {
		Aacute: Rs,
		aacute: Ns,
		Abreve: Ms,
		abreve: Ls,
		ac: Is,
		acd: Fs,
		acE: Os,
		Acirc: Bs,
		acirc: Ps,
		acute: zs,
		Acy: $s,
		acy: Us,
		AElig: Vs,
		aelig: Hs,
		af: Gs,
		Afr: js,
		afr: Zs,
		Agrave: Ws,
		agrave: Ks,
		alefsym: Js,
		aleph: Ys,
		Alpha: Xs,
		alpha: Qs,
		Amacr: ec,
		amacr: nc,
		amalg: tc,
		amp: rc,
		AMP: oc,
		andand: sc,
		And: cc,
		and: ic,
		andd: ac,
		andslope: lc,
		andv: uc,
		ang: fc,
		ange: pc,
		angle: hc,
		angmsdaa: dc,
		angmsdab: gc,
		angmsdac: mc,
		angmsdad: bc,
		angmsdae: _c,
		angmsdaf: kc,
		angmsdag: vc,
		angmsdah: xc,
		angmsd: yc,
		angrt: wc,
		angrtvb: Ec,
		angrtvbd: Ac,
		angsph: Cc,
		angst: Sc,
		angzarr: Dc,
		Aogon: qc,
		aogon: Tc,
		Aopf: Rc,
		aopf: Nc,
		apacir: Mc,
		ap: Lc,
		apE: Ic,
		ape: Fc,
		apid: Oc,
		apos: Bc,
		ApplyFunction: Pc,
		approx: zc,
		approxeq: $c,
		Aring: Uc,
		aring: Vc,
		Ascr: Hc,
		ascr: Gc,
		Assign: jc,
		ast: Zc,
		asymp: Wc,
		asympeq: Kc,
		Atilde: Jc,
		atilde: Yc,
		Auml: Xc,
		auml: Qc,
		awconint: ei,
		awint: ni,
		backcong: ti,
		backepsilon: ri,
		backprime: oi,
		backsim: si,
		backsimeq: ci,
		Backslash: ii,
		Barv: ai,
		barvee: li,
		barwed: ui,
		Barwed: fi,
		barwedge: pi,
		bbrk: hi,
		bbrktbrk: di,
		bcong: gi,
		Bcy: mi,
		bcy: bi,
		bdquo: _i,
		becaus: ki,
		because: vi,
		Because: xi,
		bemptyv: yi,
		bepsi: wi,
		bernou: Ei,
		Bernoullis: Ai,
		Beta: Ci,
		beta: Si,
		beth: Di,
		between: qi,
		Bfr: Ti,
		bfr: Ri,
		bigcap: Ni,
		bigcirc: Mi,
		bigcup: Li,
		bigodot: Ii,
		bigoplus: Fi,
		bigotimes: Oi,
		bigsqcup: Bi,
		bigstar: Pi,
		bigtriangledown: zi,
		bigtriangleup: $i,
		biguplus: Ui,
		bigvee: Vi,
		bigwedge: Hi,
		bkarow: Gi,
		blacklozenge: ji,
		blacksquare: Zi,
		blacktriangle: Wi,
		blacktriangledown: Ki,
		blacktriangleleft: Ji,
		blacktriangleright: Yi,
		blank: Xi,
		blk12: Qi,
		blk14: ea,
		blk34: na,
		block: ta,
		bne: ra,
		bnequiv: oa,
		bNot: sa,
		bnot: ca,
		Bopf: ia,
		bopf: aa,
		bot: la,
		bottom: ua,
		bowtie: fa,
		boxbox: pa,
		boxdl: ha,
		boxdL: da,
		boxDl: ga,
		boxDL: ma,
		boxdr: ba,
		boxdR: _a,
		boxDr: ka,
		boxDR: va,
		boxh: xa,
		boxH: ya,
		boxhd: wa,
		boxHd: Ea,
		boxhD: Aa,
		boxHD: Ca,
		boxhu: Sa,
		boxHu: Da,
		boxhU: qa,
		boxHU: Ta,
		boxminus: Ra,
		boxplus: Na,
		boxtimes: Ma,
		boxul: La,
		boxuL: Ia,
		boxUl: Fa,
		boxUL: Oa,
		boxur: Ba,
		boxuR: Pa,
		boxUr: za,
		boxUR: $a,
		boxv: Ua,
		boxV: Va,
		boxvh: Ha,
		boxvH: Ga,
		boxVh: ja,
		boxVH: Za,
		boxvl: Wa,
		boxvL: Ka,
		boxVl: Ja,
		boxVL: Ya,
		boxvr: Xa,
		boxvR: Qa,
		boxVr: el,
		boxVR: nl,
		bprime: tl,
		breve: rl,
		Breve: ol,
		brvbar: sl,
		bscr: cl,
		Bscr: il,
		bsemi: al,
		bsim: ll,
		bsime: ul,
		bsolb: fl,
		bsol: pl,
		bsolhsub: hl,
		bull: dl,
		bullet: gl,
		bump: ml,
		bumpE: bl,
		bumpe: _l,
		Bumpeq: kl,
		bumpeq: vl,
		Cacute: xl,
		cacute: yl,
		capand: wl,
		capbrcup: El,
		capcap: Al,
		cap: Cl,
		Cap: Sl,
		capcup: Dl,
		capdot: ql,
		CapitalDifferentialD: Tl,
		caps: Rl,
		caret: Nl,
		caron: Ml,
		Cayleys: Ll,
		ccaps: Il,
		Ccaron: Fl,
		ccaron: Ol,
		Ccedil: Bl,
		ccedil: Pl,
		Ccirc: zl,
		ccirc: $l,
		Cconint: Ul,
		ccups: Vl,
		ccupssm: Hl,
		Cdot: Gl,
		cdot: jl,
		cedil: Zl,
		Cedilla: Wl,
		cemptyv: Kl,
		cent: Jl,
		centerdot: Yl,
		CenterDot: Xl,
		cfr: Ql,
		Cfr: eu,
		CHcy: nu,
		chcy: tu,
		check: ru,
		checkmark: ou,
		Chi: su,
		chi: cu,
		circ: iu,
		circeq: au,
		circlearrowleft: lu,
		circlearrowright: uu,
		circledast: fu,
		circledcirc: pu,
		circleddash: hu,
		CircleDot: du,
		circledR: gu,
		circledS: mu,
		CircleMinus: bu,
		CirclePlus: _u,
		CircleTimes: ku,
		cir: vu,
		cirE: xu,
		cire: yu,
		cirfnint: wu,
		cirmid: Eu,
		cirscir: Au,
		ClockwiseContourIntegral: Cu,
		CloseCurlyDoubleQuote: Su,
		CloseCurlyQuote: Du,
		clubs: qu,
		clubsuit: Tu,
		colon: Ru,
		Colon: Nu,
		Colone: Mu,
		colone: Lu,
		coloneq: Iu,
		comma: Fu,
		commat: Ou,
		comp: Bu,
		compfn: Pu,
		complement: zu,
		complexes: $u,
		cong: Uu,
		congdot: Vu,
		Congruent: Hu,
		conint: Gu,
		Conint: ju,
		ContourIntegral: Zu,
		copf: Wu,
		Copf: Ku,
		coprod: Ju,
		Coproduct: Yu,
		copy: Xu,
		COPY: Qu,
		copysr: ef,
		CounterClockwiseContourIntegral: nf,
		crarr: tf,
		cross: rf,
		Cross: of,
		Cscr: sf,
		cscr: cf,
		csub: af,
		csube: lf,
		csup: uf,
		csupe: ff,
		ctdot: pf,
		cudarrl: hf,
		cudarrr: df,
		cuepr: gf,
		cuesc: mf,
		cularr: bf,
		cularrp: _f,
		cupbrcap: kf,
		cupcap: vf,
		CupCap: xf,
		cup: yf,
		Cup: wf,
		cupcup: Ef,
		cupdot: Af,
		cupor: Cf,
		cups: Sf,
		curarr: Df,
		curarrm: qf,
		curlyeqprec: Tf,
		curlyeqsucc: Rf,
		curlyvee: Nf,
		curlywedge: Mf,
		curren: Lf,
		curvearrowleft: If,
		curvearrowright: Ff,
		cuvee: Of,
		cuwed: Bf,
		cwconint: Pf,
		cwint: zf,
		cylcty: $f,
		dagger: Uf,
		Dagger: Vf,
		daleth: Hf,
		darr: Gf,
		Darr: jf,
		dArr: Zf,
		dash: Wf,
		Dashv: Kf,
		dashv: Jf,
		dbkarow: Yf,
		dblac: Xf,
		Dcaron: Qf,
		dcaron: ep,
		Dcy: np,
		dcy: tp,
		ddagger: rp,
		ddarr: op,
		DD: sp,
		dd: cp,
		DDotrahd: ip,
		ddotseq: ap,
		deg: lp,
		Del: up,
		Delta: fp,
		delta: pp,
		demptyv: hp,
		dfisht: dp,
		Dfr: gp,
		dfr: mp,
		dHar: bp,
		dharl: _p,
		dharr: kp,
		DiacriticalAcute: vp,
		DiacriticalDot: xp,
		DiacriticalDoubleAcute: yp,
		DiacriticalGrave: wp,
		DiacriticalTilde: Ep,
		diam: Ap,
		diamond: Cp,
		Diamond: Sp,
		diamondsuit: Dp,
		diams: qp,
		die: Tp,
		DifferentialD: Rp,
		digamma: Np,
		disin: Mp,
		div: Lp,
		divide: Ip,
		divideontimes: Fp,
		divonx: Op,
		DJcy: Bp,
		djcy: Pp,
		dlcorn: zp,
		dlcrop: $p,
		dollar: Up,
		Dopf: Vp,
		dopf: Hp,
		Dot: Gp,
		dot: jp,
		DotDot: Zp,
		doteq: Wp,
		doteqdot: Kp,
		DotEqual: Jp,
		dotminus: Yp,
		dotplus: Xp,
		dotsquare: Qp,
		doublebarwedge: eh,
		DoubleContourIntegral: nh,
		DoubleDot: th,
		DoubleDownArrow: rh,
		DoubleLeftArrow: oh,
		DoubleLeftRightArrow: sh,
		DoubleLeftTee: ch,
		DoubleLongLeftArrow: ih,
		DoubleLongLeftRightArrow: ah,
		DoubleLongRightArrow: lh,
		DoubleRightArrow: uh,
		DoubleRightTee: fh,
		DoubleUpArrow: ph,
		DoubleUpDownArrow: hh,
		DoubleVerticalBar: dh,
		DownArrowBar: gh,
		downarrow: mh,
		DownArrow: bh,
		Downarrow: _h,
		DownArrowUpArrow: kh,
		DownBreve: vh,
		downdownarrows: xh,
		downharpoonleft: yh,
		downharpoonright: wh,
		DownLeftRightVector: Eh,
		DownLeftTeeVector: Ah,
		DownLeftVectorBar: Ch,
		DownLeftVector: Sh,
		DownRightTeeVector: Dh,
		DownRightVectorBar: qh,
		DownRightVector: Th,
		DownTeeArrow: Rh,
		DownTee: Nh,
		drbkarow: Mh,
		drcorn: Lh,
		drcrop: Ih,
		Dscr: Fh,
		dscr: Oh,
		DScy: Bh,
		dscy: Ph,
		dsol: zh,
		Dstrok: $h,
		dstrok: Uh,
		dtdot: Vh,
		dtri: Hh,
		dtrif: Gh,
		duarr: jh,
		duhar: Zh,
		dwangle: Wh,
		DZcy: Kh,
		dzcy: Jh,
		dzigrarr: Yh,
		Eacute: Xh,
		eacute: Qh,
		easter: ed,
		Ecaron: nd,
		ecaron: td,
		Ecirc: rd,
		ecirc: od,
		ecir: sd,
		ecolon: cd,
		Ecy: id,
		ecy: ad,
		eDDot: ld,
		Edot: ud,
		edot: fd,
		eDot: pd,
		ee: hd,
		efDot: dd,
		Efr: gd,
		efr: md,
		eg: bd,
		Egrave: _d,
		egrave: kd,
		egs: vd,
		egsdot: xd,
		el: yd,
		Element: wd,
		elinters: Ed,
		ell: Ad,
		els: Cd,
		elsdot: Sd,
		Emacr: Dd,
		emacr: qd,
		empty: Td,
		emptyset: Rd,
		EmptySmallSquare: Nd,
		emptyv: Md,
		EmptyVerySmallSquare: Ld,
		emsp13: Id,
		emsp14: Fd,
		emsp: Od,
		ENG: Bd,
		eng: Pd,
		ensp: zd,
		Eogon: $d,
		eogon: Ud,
		Eopf: Vd,
		eopf: Hd,
		epar: Gd,
		eparsl: jd,
		eplus: Zd,
		epsi: Wd,
		Epsilon: Kd,
		epsilon: Jd,
		epsiv: Yd,
		eqcirc: Xd,
		eqcolon: Qd,
		eqsim: eg,
		eqslantgtr: ng,
		eqslantless: tg,
		Equal: rg,
		equals: og,
		EqualTilde: sg,
		equest: cg,
		Equilibrium: ig,
		equiv: ag,
		equivDD: lg,
		eqvparsl: ug,
		erarr: fg,
		erDot: pg,
		escr: hg,
		Escr: dg,
		esdot: gg,
		Esim: mg,
		esim: bg,
		Eta: _g,
		eta: kg,
		ETH: vg,
		eth: xg,
		Euml: yg,
		euml: wg,
		euro: Eg,
		excl: Ag,
		exist: Cg,
		Exists: Sg,
		expectation: Dg,
		exponentiale: qg,
		ExponentialE: Tg,
		fallingdotseq: Rg,
		Fcy: Ng,
		fcy: Mg,
		female: Lg,
		ffilig: Ig,
		fflig: Fg,
		ffllig: Og,
		Ffr: Bg,
		ffr: Pg,
		filig: zg,
		FilledSmallSquare: $g,
		FilledVerySmallSquare: Ug,
		fjlig: Vg,
		flat: Hg,
		fllig: Gg,
		fltns: jg,
		fnof: Zg,
		Fopf: Wg,
		fopf: Kg,
		forall: Jg,
		ForAll: Yg,
		fork: Xg,
		forkv: Qg,
		Fouriertrf: em,
		fpartint: nm,
		frac12: tm,
		frac13: rm,
		frac14: om,
		frac15: sm,
		frac16: cm,
		frac18: im,
		frac23: am,
		frac25: lm,
		frac34: um,
		frac35: fm,
		frac38: pm,
		frac45: hm,
		frac56: dm,
		frac58: gm,
		frac78: mm,
		frasl: bm,
		frown: _m,
		fscr: km,
		Fscr: vm,
		gacute: xm,
		Gamma: ym,
		gamma: wm,
		Gammad: Em,
		gammad: Am,
		gap: Cm,
		Gbreve: Sm,
		gbreve: Dm,
		Gcedil: qm,
		Gcirc: Tm,
		gcirc: Rm,
		Gcy: Nm,
		gcy: Mm,
		Gdot: Lm,
		gdot: Im,
		ge: Fm,
		gE: Om,
		gEl: Bm,
		gel: Pm,
		geq: zm,
		geqq: $m,
		geqslant: Um,
		gescc: Vm,
		ges: Hm,
		gesdot: Gm,
		gesdoto: jm,
		gesdotol: Zm,
		gesl: Wm,
		gesles: Km,
		Gfr: Jm,
		gfr: Ym,
		gg: Xm,
		Gg: Qm,
		ggg: eb,
		gimel: nb,
		GJcy: tb,
		gjcy: rb,
		gla: ob,
		gl: sb,
		glE: cb,
		glj: ib,
		gnap: ab,
		gnapprox: lb,
		gne: ub,
		gnE: fb,
		gneq: pb,
		gneqq: hb,
		gnsim: db,
		Gopf: gb,
		gopf: mb,
		grave: bb,
		GreaterEqual: _b,
		GreaterEqualLess: kb,
		GreaterFullEqual: vb,
		GreaterGreater: xb,
		GreaterLess: yb,
		GreaterSlantEqual: wb,
		GreaterTilde: Eb,
		Gscr: Ab,
		gscr: Cb,
		gsim: Sb,
		gsime: Db,
		gsiml: qb,
		gtcc: Tb,
		gtcir: Rb,
		gt: Nb,
		GT: Mb,
		Gt: Lb,
		gtdot: Ib,
		gtlPar: Fb,
		gtquest: Ob,
		gtrapprox: Bb,
		gtrarr: Pb,
		gtrdot: zb,
		gtreqless: $b,
		gtreqqless: Ub,
		gtrless: Vb,
		gtrsim: Hb,
		gvertneqq: Gb,
		gvnE: jb,
		Hacek: Zb,
		hairsp: Wb,
		half: Kb,
		hamilt: Jb,
		HARDcy: Yb,
		hardcy: Xb,
		harrcir: Qb,
		harr: e_,
		hArr: n_,
		harrw: t_,
		Hat: r_,
		hbar: o_,
		Hcirc: s_,
		hcirc: c_,
		hearts: i_,
		heartsuit: a_,
		hellip: l_,
		hercon: u_,
		hfr: f_,
		Hfr: p_,
		HilbertSpace: h_,
		hksearow: d_,
		hkswarow: g_,
		hoarr: m_,
		homtht: b_,
		hookleftarrow: __,
		hookrightarrow: k_,
		hopf: v_,
		Hopf: x_,
		horbar: y_,
		HorizontalLine: w_,
		hscr: E_,
		Hscr: A_,
		hslash: C_,
		Hstrok: S_,
		hstrok: D_,
		HumpDownHump: q_,
		HumpEqual: T_,
		hybull: R_,
		hyphen: N_,
		Iacute: M_,
		iacute: L_,
		ic: I_,
		Icirc: F_,
		icirc: O_,
		Icy: B_,
		icy: P_,
		Idot: z_,
		IEcy: $_,
		iecy: U_,
		iexcl: V_,
		iff: H_,
		ifr: G_,
		Ifr: j_,
		Igrave: Z_,
		igrave: W_,
		ii: K_,
		iiiint: J_,
		iiint: Y_,
		iinfin: X_,
		iiota: Q_,
		IJlig: e0,
		ijlig: n0,
		Imacr: t0,
		imacr: r0,
		image: o0,
		ImaginaryI: s0,
		imagline: c0,
		imagpart: i0,
		imath: a0,
		Im: l0,
		imof: u0,
		imped: f0,
		Implies: p0,
		incare: h0,
		in: "∈",
		infin: d0,
		infintie: g0,
		inodot: m0,
		intcal: b0,
		int: _0,
		Int: k0,
		integers: v0,
		Integral: x0,
		intercal: y0,
		Intersection: w0,
		intlarhk: E0,
		intprod: A0,
		InvisibleComma: C0,
		InvisibleTimes: S0,
		IOcy: D0,
		iocy: q0,
		Iogon: T0,
		iogon: R0,
		Iopf: N0,
		iopf: M0,
		Iota: L0,
		iota: I0,
		iprod: F0,
		iquest: O0,
		iscr: B0,
		Iscr: P0,
		isin: z0,
		isindot: $0,
		isinE: U0,
		isins: V0,
		isinsv: H0,
		isinv: G0,
		it: j0,
		Itilde: Z0,
		itilde: W0,
		Iukcy: K0,
		iukcy: J0,
		Iuml: Y0,
		iuml: X0,
		Jcirc: Q0,
		jcirc: ek,
		Jcy: nk,
		jcy: tk,
		Jfr: rk,
		jfr: ok,
		jmath: sk,
		Jopf: ck,
		jopf: ik,
		Jscr: ak,
		jscr: lk,
		Jsercy: uk,
		jsercy: fk,
		Jukcy: pk,
		jukcy: hk,
		Kappa: dk,
		kappa: gk,
		kappav: mk,
		Kcedil: bk,
		kcedil: _k,
		Kcy: kk,
		kcy: vk,
		Kfr: xk,
		kfr: yk,
		kgreen: wk,
		KHcy: Ek,
		khcy: Ak,
		KJcy: Ck,
		kjcy: Sk,
		Kopf: Dk,
		kopf: qk,
		Kscr: Tk,
		kscr: Rk,
		lAarr: Nk,
		Lacute: Mk,
		lacute: Lk,
		laemptyv: Ik,
		lagran: Fk,
		Lambda: Ok,
		lambda: Bk,
		lang: Pk,
		Lang: zk,
		langd: $k,
		langle: Uk,
		lap: Vk,
		Laplacetrf: Hk,
		laquo: Gk,
		larrb: jk,
		larrbfs: Zk,
		larr: Wk,
		Larr: Kk,
		lArr: Jk,
		larrfs: Yk,
		larrhk: Xk,
		larrlp: Qk,
		larrpl: ev,
		larrsim: nv,
		larrtl: tv,
		latail: rv,
		lAtail: ov,
		lat: sv,
		late: cv,
		lates: iv,
		lbarr: av,
		lBarr: lv,
		lbbrk: uv,
		lbrace: fv,
		lbrack: pv,
		lbrke: hv,
		lbrksld: dv,
		lbrkslu: gv,
		Lcaron: mv,
		lcaron: bv,
		Lcedil: _v,
		lcedil: kv,
		lceil: vv,
		lcub: xv,
		Lcy: yv,
		lcy: wv,
		ldca: Ev,
		ldquo: Av,
		ldquor: Cv,
		ldrdhar: Sv,
		ldrushar: Dv,
		ldsh: qv,
		le: Tv,
		lE: Rv,
		LeftAngleBracket: Nv,
		LeftArrowBar: Mv,
		leftarrow: Lv,
		LeftArrow: Iv,
		Leftarrow: Fv,
		LeftArrowRightArrow: Ov,
		leftarrowtail: Bv,
		LeftCeiling: Pv,
		LeftDoubleBracket: zv,
		LeftDownTeeVector: $v,
		LeftDownVectorBar: Uv,
		LeftDownVector: Vv,
		LeftFloor: Hv,
		leftharpoondown: Gv,
		leftharpoonup: jv,
		leftleftarrows: Zv,
		leftrightarrow: Wv,
		LeftRightArrow: Kv,
		Leftrightarrow: Jv,
		leftrightarrows: Yv,
		leftrightharpoons: Xv,
		leftrightsquigarrow: Qv,
		LeftRightVector: ex,
		LeftTeeArrow: nx,
		LeftTee: tx,
		LeftTeeVector: rx,
		leftthreetimes: ox,
		LeftTriangleBar: sx,
		LeftTriangle: cx,
		LeftTriangleEqual: ix,
		LeftUpDownVector: ax,
		LeftUpTeeVector: lx,
		LeftUpVectorBar: ux,
		LeftUpVector: fx,
		LeftVectorBar: px,
		LeftVector: hx,
		lEg: dx,
		leg: gx,
		leq: mx,
		leqq: bx,
		leqslant: _x,
		lescc: kx,
		les: vx,
		lesdot: xx,
		lesdoto: yx,
		lesdotor: wx,
		lesg: Ex,
		lesges: Ax,
		lessapprox: Cx,
		lessdot: Sx,
		lesseqgtr: Dx,
		lesseqqgtr: qx,
		LessEqualGreater: Tx,
		LessFullEqual: Rx,
		LessGreater: Nx,
		lessgtr: Mx,
		LessLess: Lx,
		lesssim: Ix,
		LessSlantEqual: Fx,
		LessTilde: Ox,
		lfisht: Bx,
		lfloor: Px,
		Lfr: zx,
		lfr: $x,
		lg: Ux,
		lgE: Vx,
		lHar: Hx,
		lhard: Gx,
		lharu: jx,
		lharul: Zx,
		lhblk: Wx,
		LJcy: Kx,
		ljcy: Jx,
		llarr: Yx,
		ll: Xx,
		Ll: Qx,
		llcorner: ey,
		Lleftarrow: ny,
		llhard: ty,
		lltri: ry,
		Lmidot: oy,
		lmidot: sy,
		lmoustache: cy,
		lmoust: iy,
		lnap: ay,
		lnapprox: ly,
		lne: uy,
		lnE: fy,
		lneq: py,
		lneqq: hy,
		lnsim: dy,
		loang: gy,
		loarr: my,
		lobrk: by,
		longleftarrow: _y,
		LongLeftArrow: ky,
		Longleftarrow: vy,
		longleftrightarrow: xy,
		LongLeftRightArrow: yy,
		Longleftrightarrow: wy,
		longmapsto: Ey,
		longrightarrow: Ay,
		LongRightArrow: Cy,
		Longrightarrow: Sy,
		looparrowleft: Dy,
		looparrowright: qy,
		lopar: Ty,
		Lopf: Ry,
		lopf: Ny,
		loplus: My,
		lotimes: Ly,
		lowast: Iy,
		lowbar: Fy,
		LowerLeftArrow: Oy,
		LowerRightArrow: By,
		loz: Py,
		lozenge: zy,
		lozf: $y,
		lpar: Uy,
		lparlt: Vy,
		lrarr: Hy,
		lrcorner: Gy,
		lrhar: jy,
		lrhard: Zy,
		lrm: Wy,
		lrtri: Ky,
		lsaquo: Jy,
		lscr: Yy,
		Lscr: Xy,
		lsh: Qy,
		Lsh: ew,
		lsim: nw,
		lsime: tw,
		lsimg: rw,
		lsqb: ow,
		lsquo: sw,
		lsquor: cw,
		Lstrok: iw,
		lstrok: aw,
		ltcc: lw,
		ltcir: uw,
		lt: fw,
		LT: pw,
		Lt: hw,
		ltdot: dw,
		lthree: gw,
		ltimes: mw,
		ltlarr: bw,
		ltquest: _w,
		ltri: kw,
		ltrie: vw,
		ltrif: xw,
		ltrPar: yw,
		lurdshar: ww,
		luruhar: Ew,
		lvertneqq: Aw,
		lvnE: Cw,
		macr: Sw,
		male: Dw,
		malt: qw,
		maltese: Tw,
		Map: "⤅",
		map: Rw,
		mapsto: Nw,
		mapstodown: Mw,
		mapstoleft: Lw,
		mapstoup: Iw,
		marker: Fw,
		mcomma: Ow,
		Mcy: Bw,
		mcy: Pw,
		mdash: zw,
		mDDot: $w,
		measuredangle: Uw,
		MediumSpace: Vw,
		Mellintrf: Hw,
		Mfr: Gw,
		mfr: jw,
		mho: Zw,
		micro: Ww,
		midast: Kw,
		midcir: Jw,
		mid: Yw,
		middot: Xw,
		minusb: Qw,
		minus: eE,
		minusd: nE,
		minusdu: tE,
		MinusPlus: rE,
		mlcp: oE,
		mldr: sE,
		mnplus: cE,
		models: iE,
		Mopf: aE,
		mopf: lE,
		mp: uE,
		mscr: fE,
		Mscr: pE,
		mstpos: hE,
		Mu: dE,
		mu: gE,
		multimap: mE,
		mumap: bE,
		nabla: _E,
		Nacute: kE,
		nacute: vE,
		nang: xE,
		nap: yE,
		napE: wE,
		napid: EE,
		napos: AE,
		napprox: CE,
		natural: SE,
		naturals: DE,
		natur: qE,
		nbsp: TE,
		nbump: RE,
		nbumpe: NE,
		ncap: ME,
		Ncaron: LE,
		ncaron: IE,
		Ncedil: FE,
		ncedil: OE,
		ncong: BE,
		ncongdot: PE,
		ncup: zE,
		Ncy: $E,
		ncy: UE,
		ndash: VE,
		nearhk: HE,
		nearr: GE,
		neArr: jE,
		nearrow: ZE,
		ne: WE,
		nedot: KE,
		NegativeMediumSpace: JE,
		NegativeThickSpace: YE,
		NegativeThinSpace: XE,
		NegativeVeryThinSpace: QE,
		nequiv: eA,
		nesear: nA,
		nesim: tA,
		NestedGreaterGreater: rA,
		NestedLessLess: oA,
		NewLine: sA,
		nexist: cA,
		nexists: iA,
		Nfr: aA,
		nfr: lA,
		ngE: uA,
		nge: fA,
		ngeq: pA,
		ngeqq: hA,
		ngeqslant: dA,
		nges: gA,
		nGg: mA,
		ngsim: bA,
		nGt: _A,
		ngt: kA,
		ngtr: vA,
		nGtv: xA,
		nharr: yA,
		nhArr: wA,
		nhpar: EA,
		ni: AA,
		nis: CA,
		nisd: SA,
		niv: DA,
		NJcy: qA,
		njcy: TA,
		nlarr: RA,
		nlArr: NA,
		nldr: MA,
		nlE: LA,
		nle: IA,
		nleftarrow: FA,
		nLeftarrow: OA,
		nleftrightarrow: BA,
		nLeftrightarrow: PA,
		nleq: zA,
		nleqq: $A,
		nleqslant: UA,
		nles: VA,
		nless: HA,
		nLl: GA,
		nlsim: jA,
		nLt: ZA,
		nlt: WA,
		nltri: KA,
		nltrie: JA,
		nLtv: YA,
		nmid: XA,
		NoBreak: QA,
		NonBreakingSpace: eC,
		nopf: nC,
		Nopf: tC,
		Not: rC,
		not: oC,
		NotCongruent: sC,
		NotCupCap: cC,
		NotDoubleVerticalBar: iC,
		NotElement: aC,
		NotEqual: lC,
		NotEqualTilde: uC,
		NotExists: fC,
		NotGreater: pC,
		NotGreaterEqual: hC,
		NotGreaterFullEqual: dC,
		NotGreaterGreater: gC,
		NotGreaterLess: mC,
		NotGreaterSlantEqual: bC,
		NotGreaterTilde: _C,
		NotHumpDownHump: kC,
		NotHumpEqual: vC,
		notin: xC,
		notindot: yC,
		notinE: wC,
		notinva: EC,
		notinvb: AC,
		notinvc: CC,
		NotLeftTriangleBar: SC,
		NotLeftTriangle: DC,
		NotLeftTriangleEqual: qC,
		NotLess: TC,
		NotLessEqual: RC,
		NotLessGreater: NC,
		NotLessLess: MC,
		NotLessSlantEqual: LC,
		NotLessTilde: IC,
		NotNestedGreaterGreater: FC,
		NotNestedLessLess: OC,
		notni: BC,
		notniva: PC,
		notnivb: zC,
		notnivc: $C,
		NotPrecedes: UC,
		NotPrecedesEqual: VC,
		NotPrecedesSlantEqual: HC,
		NotReverseElement: GC,
		NotRightTriangleBar: jC,
		NotRightTriangle: ZC,
		NotRightTriangleEqual: WC,
		NotSquareSubset: KC,
		NotSquareSubsetEqual: JC,
		NotSquareSuperset: YC,
		NotSquareSupersetEqual: XC,
		NotSubset: QC,
		NotSubsetEqual: e1,
		NotSucceeds: n1,
		NotSucceedsEqual: t1,
		NotSucceedsSlantEqual: r1,
		NotSucceedsTilde: o1,
		NotSuperset: s1,
		NotSupersetEqual: c1,
		NotTilde: i1,
		NotTildeEqual: a1,
		NotTildeFullEqual: l1,
		NotTildeTilde: u1,
		NotVerticalBar: f1,
		nparallel: p1,
		npar: h1,
		nparsl: d1,
		npart: g1,
		npolint: m1,
		npr: b1,
		nprcue: _1,
		nprec: k1,
		npreceq: v1,
		npre: x1,
		nrarrc: y1,
		nrarr: w1,
		nrArr: E1,
		nrarrw: A1,
		nrightarrow: C1,
		nRightarrow: S1,
		nrtri: D1,
		nrtrie: q1,
		nsc: T1,
		nsccue: R1,
		nsce: N1,
		Nscr: M1,
		nscr: L1,
		nshortmid: I1,
		nshortparallel: F1,
		nsim: O1,
		nsime: B1,
		nsimeq: P1,
		nsmid: z1,
		nspar: $1,
		nsqsube: U1,
		nsqsupe: V1,
		nsub: H1,
		nsubE: G1,
		nsube: j1,
		nsubset: Z1,
		nsubseteq: W1,
		nsubseteqq: K1,
		nsucc: J1,
		nsucceq: Y1,
		nsup: X1,
		nsupE: Q1,
		nsupe: eS,
		nsupset: nS,
		nsupseteq: tS,
		nsupseteqq: rS,
		ntgl: oS,
		Ntilde: sS,
		ntilde: cS,
		ntlg: iS,
		ntriangleleft: aS,
		ntrianglelefteq: lS,
		ntriangleright: uS,
		ntrianglerighteq: fS,
		Nu: pS,
		nu: hS,
		num: dS,
		numero: gS,
		numsp: mS,
		nvap: bS,
		nvdash: _S,
		nvDash: kS,
		nVdash: vS,
		nVDash: xS,
		nvge: yS,
		nvgt: wS,
		nvHarr: ES,
		nvinfin: AS,
		nvlArr: CS,
		nvle: SS,
		nvlt: DS,
		nvltrie: qS,
		nvrArr: TS,
		nvrtrie: RS,
		nvsim: NS,
		nwarhk: MS,
		nwarr: LS,
		nwArr: IS,
		nwarrow: FS,
		nwnear: OS,
		Oacute: BS,
		oacute: PS,
		oast: zS,
		Ocirc: $S,
		ocirc: US,
		ocir: VS,
		Ocy: HS,
		ocy: GS,
		odash: jS,
		Odblac: ZS,
		odblac: WS,
		odiv: KS,
		odot: JS,
		odsold: YS,
		OElig: XS,
		oelig: QS,
		ofcir: eD,
		Ofr: nD,
		ofr: tD,
		ogon: rD,
		Ograve: oD,
		ograve: sD,
		ogt: cD,
		ohbar: iD,
		ohm: aD,
		oint: lD,
		olarr: uD,
		olcir: fD,
		olcross: pD,
		oline: hD,
		olt: dD,
		Omacr: gD,
		omacr: mD,
		Omega: bD,
		omega: _D,
		Omicron: kD,
		omicron: vD,
		omid: xD,
		ominus: yD,
		Oopf: wD,
		oopf: ED,
		opar: AD,
		OpenCurlyDoubleQuote: CD,
		OpenCurlyQuote: SD,
		operp: DD,
		oplus: qD,
		orarr: TD,
		Or: RD,
		or: ND,
		ord: MD,
		order: LD,
		orderof: ID,
		ordf: FD,
		ordm: OD,
		origof: BD,
		oror: PD,
		orslope: zD,
		orv: $D,
		oS: UD,
		Oscr: VD,
		oscr: HD,
		Oslash: GD,
		oslash: jD,
		osol: ZD,
		Otilde: WD,
		otilde: KD,
		otimesas: JD,
		Otimes: YD,
		otimes: XD,
		Ouml: QD,
		ouml: eq,
		ovbar: nq,
		OverBar: tq,
		OverBrace: rq,
		OverBracket: oq,
		OverParenthesis: sq,
		para: cq,
		parallel: iq,
		par: aq,
		parsim: lq,
		parsl: uq,
		part: fq,
		PartialD: pq,
		Pcy: hq,
		pcy: dq,
		percnt: gq,
		period: mq,
		permil: bq,
		perp: _q,
		pertenk: kq,
		Pfr: vq,
		pfr: xq,
		Phi: yq,
		phi: wq,
		phiv: Eq,
		phmmat: Aq,
		phone: Cq,
		Pi: Sq,
		pi: Dq,
		pitchfork: qq,
		piv: Tq,
		planck: Rq,
		planckh: Nq,
		plankv: Mq,
		plusacir: Lq,
		plusb: Iq,
		pluscir: Fq,
		plus: Oq,
		plusdo: Bq,
		plusdu: Pq,
		pluse: zq,
		PlusMinus: $q,
		plusmn: Uq,
		plussim: Vq,
		plustwo: Hq,
		pm: Gq,
		Poincareplane: jq,
		pointint: Zq,
		popf: Wq,
		Popf: Kq,
		pound: Jq,
		prap: Yq,
		Pr: Xq,
		pr: Qq,
		prcue: eT,
		precapprox: nT,
		prec: tT,
		preccurlyeq: rT,
		Precedes: oT,
		PrecedesEqual: sT,
		PrecedesSlantEqual: cT,
		PrecedesTilde: iT,
		preceq: aT,
		precnapprox: lT,
		precneqq: uT,
		precnsim: fT,
		pre: pT,
		prE: hT,
		precsim: dT,
		prime: gT,
		Prime: mT,
		primes: bT,
		prnap: _T,
		prnE: kT,
		prnsim: vT,
		prod: xT,
		Product: yT,
		profalar: wT,
		profline: ET,
		profsurf: AT,
		prop: CT,
		Proportional: ST,
		Proportion: DT,
		propto: qT,
		prsim: TT,
		prurel: RT,
		Pscr: NT,
		pscr: MT,
		Psi: LT,
		psi: IT,
		puncsp: FT,
		Qfr: OT,
		qfr: BT,
		qint: PT,
		qopf: zT,
		Qopf: $T,
		qprime: UT,
		Qscr: VT,
		qscr: HT,
		quaternions: GT,
		quatint: jT,
		quest: ZT,
		questeq: WT,
		quot: KT,
		QUOT: JT,
		rAarr: YT,
		race: XT,
		Racute: QT,
		racute: eR,
		radic: nR,
		raemptyv: tR,
		rang: rR,
		Rang: oR,
		rangd: sR,
		range: cR,
		rangle: iR,
		raquo: aR,
		rarrap: lR,
		rarrb: uR,
		rarrbfs: fR,
		rarrc: pR,
		rarr: hR,
		Rarr: dR,
		rArr: gR,
		rarrfs: mR,
		rarrhk: bR,
		rarrlp: _R,
		rarrpl: kR,
		rarrsim: vR,
		Rarrtl: xR,
		rarrtl: yR,
		rarrw: wR,
		ratail: ER,
		rAtail: AR,
		ratio: CR,
		rationals: SR,
		rbarr: DR,
		rBarr: qR,
		RBarr: TR,
		rbbrk: RR,
		rbrace: NR,
		rbrack: MR,
		rbrke: LR,
		rbrksld: IR,
		rbrkslu: FR,
		Rcaron: OR,
		rcaron: BR,
		Rcedil: PR,
		rcedil: zR,
		rceil: $R,
		rcub: UR,
		Rcy: VR,
		rcy: HR,
		rdca: GR,
		rdldhar: jR,
		rdquo: ZR,
		rdquor: WR,
		rdsh: KR,
		real: JR,
		realine: YR,
		realpart: XR,
		reals: QR,
		Re: eN,
		rect: nN,
		reg: tN,
		REG: rN,
		ReverseElement: oN,
		ReverseEquilibrium: sN,
		ReverseUpEquilibrium: cN,
		rfisht: iN,
		rfloor: aN,
		rfr: lN,
		Rfr: uN,
		rHar: fN,
		rhard: pN,
		rharu: hN,
		rharul: dN,
		Rho: gN,
		rho: mN,
		rhov: bN,
		RightAngleBracket: _N,
		RightArrowBar: kN,
		rightarrow: vN,
		RightArrow: xN,
		Rightarrow: yN,
		RightArrowLeftArrow: wN,
		rightarrowtail: EN,
		RightCeiling: AN,
		RightDoubleBracket: CN,
		RightDownTeeVector: SN,
		RightDownVectorBar: DN,
		RightDownVector: qN,
		RightFloor: TN,
		rightharpoondown: RN,
		rightharpoonup: NN,
		rightleftarrows: MN,
		rightleftharpoons: LN,
		rightrightarrows: IN,
		rightsquigarrow: FN,
		RightTeeArrow: ON,
		RightTee: BN,
		RightTeeVector: PN,
		rightthreetimes: zN,
		RightTriangleBar: $N,
		RightTriangle: UN,
		RightTriangleEqual: VN,
		RightUpDownVector: HN,
		RightUpTeeVector: GN,
		RightUpVectorBar: jN,
		RightUpVector: ZN,
		RightVectorBar: WN,
		RightVector: KN,
		ring: JN,
		risingdotseq: YN,
		rlarr: XN,
		rlhar: QN,
		rlm: eM,
		rmoustache: nM,
		rmoust: tM,
		rnmid: rM,
		roang: oM,
		roarr: sM,
		robrk: cM,
		ropar: iM,
		ropf: aM,
		Ropf: lM,
		roplus: uM,
		rotimes: fM,
		RoundImplies: pM,
		rpar: hM,
		rpargt: dM,
		rppolint: gM,
		rrarr: mM,
		Rrightarrow: bM,
		rsaquo: _M,
		rscr: kM,
		Rscr: vM,
		rsh: xM,
		Rsh: yM,
		rsqb: wM,
		rsquo: EM,
		rsquor: AM,
		rthree: CM,
		rtimes: SM,
		rtri: DM,
		rtrie: qM,
		rtrif: TM,
		rtriltri: RM,
		RuleDelayed: NM,
		ruluhar: MM,
		rx: LM,
		Sacute: IM,
		sacute: FM,
		sbquo: OM,
		scap: BM,
		Scaron: PM,
		scaron: zM,
		Sc: $M,
		sc: UM,
		sccue: VM,
		sce: HM,
		scE: GM,
		Scedil: jM,
		scedil: ZM,
		Scirc: WM,
		scirc: KM,
		scnap: JM,
		scnE: YM,
		scnsim: XM,
		scpolint: QM,
		scsim: eL,
		Scy: nL,
		scy: tL,
		sdotb: rL,
		sdot: oL,
		sdote: sL,
		searhk: cL,
		searr: iL,
		seArr: aL,
		searrow: lL,
		sect: uL,
		semi: fL,
		seswar: pL,
		setminus: hL,
		setmn: dL,
		sext: gL,
		Sfr: mL,
		sfr: bL,
		sfrown: _L,
		sharp: kL,
		SHCHcy: vL,
		shchcy: xL,
		SHcy: yL,
		shcy: wL,
		ShortDownArrow: EL,
		ShortLeftArrow: AL,
		shortmid: CL,
		shortparallel: SL,
		ShortRightArrow: DL,
		ShortUpArrow: qL,
		shy: TL,
		Sigma: RL,
		sigma: NL,
		sigmaf: ML,
		sigmav: LL,
		sim: IL,
		simdot: FL,
		sime: OL,
		simeq: BL,
		simg: PL,
		simgE: zL,
		siml: $L,
		simlE: UL,
		simne: VL,
		simplus: HL,
		simrarr: GL,
		slarr: jL,
		SmallCircle: ZL,
		smallsetminus: WL,
		smashp: KL,
		smeparsl: JL,
		smid: YL,
		smile: XL,
		smt: QL,
		smte: e2,
		smtes: n2,
		SOFTcy: t2,
		softcy: r2,
		solbar: o2,
		solb: s2,
		sol: c2,
		Sopf: i2,
		sopf: a2,
		spades: l2,
		spadesuit: u2,
		spar: f2,
		sqcap: p2,
		sqcaps: h2,
		sqcup: d2,
		sqcups: g2,
		Sqrt: m2,
		sqsub: b2,
		sqsube: _2,
		sqsubset: k2,
		sqsubseteq: v2,
		sqsup: x2,
		sqsupe: y2,
		sqsupset: w2,
		sqsupseteq: E2,
		square: A2,
		Square: C2,
		SquareIntersection: S2,
		SquareSubset: D2,
		SquareSubsetEqual: q2,
		SquareSuperset: T2,
		SquareSupersetEqual: R2,
		SquareUnion: N2,
		squarf: M2,
		squ: L2,
		squf: I2,
		srarr: F2,
		Sscr: O2,
		sscr: B2,
		ssetmn: P2,
		ssmile: z2,
		sstarf: $2,
		Star: U2,
		star: V2,
		starf: H2,
		straightepsilon: G2,
		straightphi: j2,
		strns: Z2,
		sub: W2,
		Sub: K2,
		subdot: J2,
		subE: Y2,
		sube: X2,
		subedot: Q2,
		submult: eI,
		subnE: nI,
		subne: tI,
		subplus: rI,
		subrarr: oI,
		subset: sI,
		Subset: cI,
		subseteq: iI,
		subseteqq: aI,
		SubsetEqual: lI,
		subsetneq: uI,
		subsetneqq: fI,
		subsim: pI,
		subsub: hI,
		subsup: dI,
		succapprox: gI,
		succ: mI,
		succcurlyeq: bI,
		Succeeds: _I,
		SucceedsEqual: kI,
		SucceedsSlantEqual: vI,
		SucceedsTilde: xI,
		succeq: yI,
		succnapprox: wI,
		succneqq: EI,
		succnsim: AI,
		succsim: CI,
		SuchThat: SI,
		sum: DI,
		Sum: qI,
		sung: TI,
		sup1: RI,
		sup2: NI,
		sup3: MI,
		sup: LI,
		Sup: II,
		supdot: FI,
		supdsub: OI,
		supE: BI,
		supe: PI,
		supedot: zI,
		Superset: $I,
		SupersetEqual: UI,
		suphsol: VI,
		suphsub: HI,
		suplarr: GI,
		supmult: jI,
		supnE: ZI,
		supne: WI,
		supplus: KI,
		supset: JI,
		Supset: YI,
		supseteq: XI,
		supseteqq: QI,
		supsetneq: eF,
		supsetneqq: nF,
		supsim: tF,
		supsub: rF,
		supsup: oF,
		swarhk: sF,
		swarr: cF,
		swArr: iF,
		swarrow: aF,
		swnwar: lF,
		szlig: uF,
		Tab: fF,
		target: pF,
		Tau: hF,
		tau: dF,
		tbrk: gF,
		Tcaron: mF,
		tcaron: bF,
		Tcedil: _F,
		tcedil: kF,
		Tcy: vF,
		tcy: xF,
		tdot: yF,
		telrec: wF,
		Tfr: EF,
		tfr: AF,
		there4: CF,
		therefore: SF,
		Therefore: DF,
		Theta: qF,
		theta: TF,
		thetasym: RF,
		thetav: NF,
		thickapprox: MF,
		thicksim: LF,
		ThickSpace: IF,
		ThinSpace: FF,
		thinsp: OF,
		thkap: BF,
		thksim: PF,
		THORN: zF,
		thorn: $F,
		tilde: UF,
		Tilde: VF,
		TildeEqual: HF,
		TildeFullEqual: GF,
		TildeTilde: jF,
		timesbar: ZF,
		timesb: WF,
		times: KF,
		timesd: JF,
		tint: YF,
		toea: XF,
		topbot: QF,
		topcir: eO,
		top: nO,
		Topf: tO,
		topf: rO,
		topfork: oO,
		tosa: sO,
		tprime: cO,
		trade: iO,
		TRADE: aO,
		triangle: lO,
		triangledown: uO,
		triangleleft: fO,
		trianglelefteq: pO,
		triangleq: hO,
		triangleright: dO,
		trianglerighteq: gO,
		tridot: mO,
		trie: bO,
		triminus: _O,
		TripleDot: kO,
		triplus: vO,
		trisb: xO,
		tritime: yO,
		trpezium: wO,
		Tscr: EO,
		tscr: AO,
		TScy: CO,
		tscy: SO,
		TSHcy: DO,
		tshcy: qO,
		Tstrok: TO,
		tstrok: RO,
		twixt: NO,
		twoheadleftarrow: MO,
		twoheadrightarrow: LO,
		Uacute: IO,
		uacute: FO,
		uarr: OO,
		Uarr: BO,
		uArr: PO,
		Uarrocir: zO,
		Ubrcy: $O,
		ubrcy: UO,
		Ubreve: VO,
		ubreve: HO,
		Ucirc: GO,
		ucirc: jO,
		Ucy: ZO,
		ucy: WO,
		udarr: KO,
		Udblac: JO,
		udblac: YO,
		udhar: XO,
		ufisht: QO,
		Ufr: eB,
		ufr: nB,
		Ugrave: tB,
		ugrave: rB,
		uHar: oB,
		uharl: sB,
		uharr: cB,
		uhblk: iB,
		ulcorn: aB,
		ulcorner: lB,
		ulcrop: uB,
		ultri: fB,
		Umacr: pB,
		umacr: hB,
		uml: dB,
		UnderBar: gB,
		UnderBrace: mB,
		UnderBracket: bB,
		UnderParenthesis: _B,
		Union: kB,
		UnionPlus: vB,
		Uogon: xB,
		uogon: yB,
		Uopf: wB,
		uopf: EB,
		UpArrowBar: AB,
		uparrow: CB,
		UpArrow: SB,
		Uparrow: DB,
		UpArrowDownArrow: qB,
		updownarrow: TB,
		UpDownArrow: RB,
		Updownarrow: NB,
		UpEquilibrium: MB,
		upharpoonleft: LB,
		upharpoonright: IB,
		uplus: FB,
		UpperLeftArrow: OB,
		UpperRightArrow: BB,
		upsi: PB,
		Upsi: zB,
		upsih: $B,
		Upsilon: UB,
		upsilon: VB,
		UpTeeArrow: HB,
		UpTee: GB,
		upuparrows: jB,
		urcorn: ZB,
		urcorner: WB,
		urcrop: KB,
		Uring: JB,
		uring: YB,
		urtri: XB,
		Uscr: QB,
		uscr: eP,
		utdot: nP,
		Utilde: tP,
		utilde: rP,
		utri: oP,
		utrif: sP,
		uuarr: cP,
		Uuml: iP,
		uuml: aP,
		uwangle: lP,
		vangrt: uP,
		varepsilon: fP,
		varkappa: pP,
		varnothing: hP,
		varphi: dP,
		varpi: gP,
		varpropto: mP,
		varr: bP,
		vArr: _P,
		varrho: kP,
		varsigma: vP,
		varsubsetneq: xP,
		varsubsetneqq: yP,
		varsupsetneq: wP,
		varsupsetneqq: EP,
		vartheta: AP,
		vartriangleleft: CP,
		vartriangleright: SP,
		vBar: DP,
		Vbar: qP,
		vBarv: TP,
		Vcy: RP,
		vcy: NP,
		vdash: MP,
		vDash: LP,
		Vdash: IP,
		VDash: FP,
		Vdashl: OP,
		veebar: BP,
		vee: PP,
		Vee: zP,
		veeeq: $P,
		vellip: UP,
		verbar: VP,
		Verbar: HP,
		vert: GP,
		Vert: jP,
		VerticalBar: ZP,
		VerticalLine: WP,
		VerticalSeparator: KP,
		VerticalTilde: JP,
		VeryThinSpace: YP,
		Vfr: XP,
		vfr: QP,
		vltri: ez,
		vnsub: nz,
		vnsup: tz,
		Vopf: rz,
		vopf: oz,
		vprop: sz,
		vrtri: cz,
		Vscr: iz,
		vscr: az,
		vsubnE: lz,
		vsubne: uz,
		vsupnE: fz,
		vsupne: pz,
		Vvdash: hz,
		vzigzag: dz,
		Wcirc: gz,
		wcirc: mz,
		wedbar: bz,
		wedge: _z,
		Wedge: kz,
		wedgeq: vz,
		weierp: xz,
		Wfr: yz,
		wfr: wz,
		Wopf: Ez,
		wopf: Az,
		wp: Cz,
		wr: Sz,
		wreath: Dz,
		Wscr: qz,
		wscr: Tz,
		xcap: Rz,
		xcirc: Nz,
		xcup: Mz,
		xdtri: Lz,
		Xfr: Iz,
		xfr: Fz,
		xharr: Oz,
		xhArr: Bz,
		Xi: Pz,
		xi: zz,
		xlarr: $z,
		xlArr: Uz,
		xmap: Vz,
		xnis: Hz,
		xodot: Gz,
		Xopf: jz,
		xopf: Zz,
		xoplus: Wz,
		xotime: Kz,
		xrarr: Jz,
		xrArr: Yz,
		Xscr: Xz,
		xscr: Qz,
		xsqcup: e3,
		xuplus: n3,
		xutri: t3,
		xvee: r3,
		xwedge: o3,
		Yacute: s3,
		yacute: c3,
		YAcy: i3,
		yacy: a3,
		Ycirc: l3,
		ycirc: u3,
		Ycy: f3,
		ycy: p3,
		yen: h3,
		Yfr: d3,
		yfr: g3,
		YIcy: m3,
		yicy: b3,
		Yopf: _3,
		yopf: k3,
		Yscr: v3,
		yscr: x3,
		YUcy: y3,
		yucy: w3,
		yuml: E3,
		Yuml: A3,
		Zacute: C3,
		zacute: S3,
		Zcaron: D3,
		zcaron: q3,
		Zcy: T3,
		zcy: R3,
		Zdot: N3,
		zdot: M3,
		zeetrf: L3,
		ZeroWidthSpace: I3,
		Zeta: F3,
		zeta: O3,
		zfr: B3,
		Zfr: P3,
		ZHcy: z3,
		zhcy: $3,
		zigrarr: U3,
		zopf: V3,
		Zopf: H3,
		Zscr: G3,
		zscr: j3,
		zwj: Z3,
		zwnj: W3
	};
var wr = K3, Vn = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, Te = {}, mt = {};
function J3(n) {
	var e, t, r = mt[n];
	if (r)
		return r;
	for (r = mt[n] = [], e = 0; e < 128; e++)
		t = String.fromCharCode(e), /^[0-9a-z]$/i.test(t) ? r.push(t) : r.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	for (e = 0; e < n.length; e++)
		r[n.charCodeAt(e)] = n[e];
	return r;
}
function sn(n, e, t) {
	var r, o, s, i, c, a = "";
	for (typeof e != "string" && (t = e, e = sn.defaultChars), typeof t > "u" && (t = !0), c = J3(e), r = 0, o = n.length; r < o; r++) {
		if (s = n.charCodeAt(r), t && s === 37 && r + 2 < o && /^[0-9a-f]{2}$/i.test(n.slice(r + 1, r + 3))) {
			a += n.slice(r, r + 3), r += 2;
			continue;
		}
		if (s < 128) {
			a += c[s];
			continue;
		}
		if (s >= 55296 && s <= 57343) {
			if (s >= 55296 && s <= 56319 && r + 1 < o && (i = n.charCodeAt(r + 1), i >= 56320 && i <= 57343)) {
				a += encodeURIComponent(n[r] + n[r + 1]), r++;
				continue;
			}
			a += "%EF%BF%BD";
			continue;
		}
		a += encodeURIComponent(n[r]);
	}
	return a;
}
sn.defaultChars = ";/?:@&=+$,-_.!~*'()#";
sn.componentChars = "-_.!~*'()";
var Y3 = sn, bt = {};
function X3(n) {
	var e, t, r = bt[n];
	if (r)
		return r;
	for (r = bt[n] = [], e = 0; e < 128; e++)
		t = String.fromCharCode(e), r.push(t);
	for (e = 0; e < n.length; e++)
		t = n.charCodeAt(e), r[t] = "%" + ("0" + t.toString(16).toUpperCase()).slice(-2);
	return r;
}
function cn(n, e) {
	var t;
	return typeof e != "string" && (e = cn.defaultChars), t = X3(e), n.replace(/(%[a-f0-9]{2})+/gi, function (r) {
		var o, s, i, c, a, l, u, h = "";
		for (o = 0, s = r.length; o < s; o += 3) {
			if (i = parseInt(r.slice(o + 1, o + 3), 16), i < 128) {
				h += t[i];
				continue;
			}
			if ((i & 224) === 192 && o + 3 < s && (c = parseInt(r.slice(o + 4, o + 6), 16), (c & 192) === 128)) {
				u = i << 6 & 1984 | c & 63, u < 128 ? h += "��" : h += String.fromCharCode(u), o += 3;
				continue;
			}
			if ((i & 240) === 224 && o + 6 < s && (c = parseInt(r.slice(o + 4, o + 6), 16), a = parseInt(r.slice(o + 7, o + 9), 16), (c & 192) === 128 && (a & 192) === 128)) {
				u = i << 12 & 61440 | c << 6 & 4032 | a & 63, u < 2048 || u >= 55296 && u <= 57343 ? h += "���" : h += String.fromCharCode(u), o += 6;
				continue;
			}
			if ((i & 248) === 240 && o + 9 < s && (c = parseInt(r.slice(o + 4, o + 6), 16), a = parseInt(r.slice(o + 7, o + 9), 16), l = parseInt(r.slice(o + 10, o + 12), 16), (c & 192) === 128 && (a & 192) === 128 && (l & 192) === 128)) {
				u = i << 18 & 1835008 | c << 12 & 258048 | a << 6 & 4032 | l & 63, u < 65536 || u > 1114111 ? h += "����" : (u -= 65536, h += String.fromCharCode(55296 + (u >> 10), 56320 + (u & 1023))), o += 9;
				continue;
			}
			h += "�";
		}
		return h;
	});
}
cn.defaultChars = ";/?:@&=+$,#";
cn.componentChars = "";
var Q3 = cn, e$ = function (e) {
	var t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
};
function nn() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var n$ = /^([a-z0-9.+-]+:)/i, t$ = /:[0-9]*$/, r$ = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, o$ = ["<", ">", '"', "`", " ", "\r", `
`, "	"], s$ = ["{", "}", "|", "\\", "^", "`"].concat(o$), c$ = ["'"].concat(s$), _t = ["%", "/", "?", ";", "#"].concat(c$), kt = ["/", "?", "#"], i$ = 255, vt = /^[+a-z0-9A-Z_-]{0,63}$/, a$ = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, xt = {
		javascript: !0,
		"javascript:": !0
	}, yt = {
		http: !0,
		https: !0,
		ftp: !0,
		gopher: !0,
		file: !0,
		"http:": !0,
		"https:": !0,
		"ftp:": !0,
		"gopher:": !0,
		"file:": !0
	};
function l$(n, e) {
	if (n && n instanceof nn)
		return n;
	var t = new nn();
	return t.parse(n, e), t;
}
nn.prototype.parse = function (n, e) {
	var t, r, o, s, i, c = n;
	if (c = c.trim(), !e && n.split("#").length === 1) {
		var a = r$.exec(c);
		if (a)
			return this.pathname = a[1], a[2] && (this.search = a[2]), this;
	}
	var l = n$.exec(c);
	if (l && (l = l[0], o = l.toLowerCase(), this.protocol = l, c = c.substr(l.length)), (e || l || c.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = c.substr(0, 2) === "//", i && !(l && xt[l]) && (c = c.substr(2), this.slashes = !0)), !xt[l] && (i || l && !yt[l])) {
		var u = -1;
		for (t = 0; t < kt.length; t++)
			s = c.indexOf(kt[t]), s !== -1 && (u === -1 || s < u) && (u = s);
		var h, f;
		for (u === -1 ? f = c.lastIndexOf("@") : f = c.lastIndexOf("@", u), f !== -1 && (h = c.slice(0, f), c = c.slice(f + 1), this.auth = h), u = -1, t = 0; t < _t.length; t++)
			s = c.indexOf(_t[t]), s !== -1 && (u === -1 || s < u) && (u = s);
		u === -1 && (u = c.length), c[u - 1] === ":" && u--;
		var p = c.slice(0, u);
		c = c.slice(u), this.parseHost(p), this.hostname = this.hostname || "";
		var g = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!g) {
			var k = this.hostname.split(/\./);
			for (t = 0, r = k.length; t < r; t++) {
				var A = k[t];
				if (A && !A.match(vt)) {
					for (var y = "", m = 0, w = A.length; m < w; m++)
						A.charCodeAt(m) > 127 ? y += "x" : y += A[m];
					if (!y.match(vt)) {
						var C = k.slice(0, t), q = k.slice(t + 1), _ = A.match(a$);
						_ && (C.push(_[1]), q.unshift(_[2])), q.length && (c = q.join(".") + c), this.hostname = C.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > i$ && (this.hostname = ""), g && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	var M = c.indexOf("#");
	M !== -1 && (this.hash = c.substr(M), c = c.slice(0, M));
	var $ = c.indexOf("?");
	return $ !== -1 && (this.search = c.substr($), c = c.slice(0, $)), c && (this.pathname = c), yt[o] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
nn.prototype.parseHost = function (n) {
	var e = t$.exec(n);
	e && (e = e[0], e !== ":" && (this.port = e.substr(1)), n = n.substr(0, n.length - e.length)), n && (this.hostname = n);
};
var u$ = l$;
Te.encode = Y3;
Te.decode = Q3;
Te.format = e$;
Te.parse = u$;
var me = {}, kn, wt;
function Er() {
	return wt || (wt = 1, kn = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/), kn;
}
var vn, Et;
function Ar() {
	return Et || (Et = 1, vn = /[\0-\x1F\x7F-\x9F]/), vn;
}
var xn, At;
function f$() {
	return At || (At = 1, xn = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/), xn;
}
var yn, Ct;
function Cr() {
	return Ct || (Ct = 1, yn = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/), yn;
}
var St;
function p$() {
	return St || (St = 1, me.Any = Er(), me.Cc = Ar(), me.Cf = f$(), me.P = Vn, me.Z = Cr()), me;
}
(function (n) {
	function e(b) {
		return Object.prototype.toString.call(b);
	}
	function t(b) {
		return e(b) === "[object String]";
	}
	var r = Object.prototype.hasOwnProperty;
	function o(b, O) {
		return r.call(b, O);
	}
	function s(b) {
		var O = Array.prototype.slice.call(arguments, 1);
		return O.forEach(function (N) {
			if (N) {
				if (typeof N != "object")
					throw new TypeError(N + "must be object");
				Object.keys(N).forEach(function (d) {
					b[d] = N[d];
				});
			}
		}), b;
	}
	function i(b, O, N) {
		return [].concat(b.slice(0, O), N, b.slice(O + 1));
	}
	function c(b) {
		return !(b >= 55296 && b <= 57343 || b >= 64976 && b <= 65007 || (b & 65535) === 65535 || (b & 65535) === 65534 || b >= 0 && b <= 8 || b === 11 || b >= 14 && b <= 31 || b >= 127 && b <= 159 || b > 1114111);
	}
	function a(b) {
		if (b > 65535) {
			b -= 65536;
			var O = 55296 + (b >> 10), N = 56320 + (b & 1023);
			return String.fromCharCode(O, N);
		}
		return String.fromCharCode(b);
	}
	var l = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g, u = /&([a-z#][a-z0-9]{1,31});/gi, h = new RegExp(l.source + "|" + u.source, "gi"), f = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i, p = wr;
	function g(b, O) {
		var N = 0;
		return o(p, O) ? p[O] : O.charCodeAt(0) === 35 && f.test(O) && (N = O[1].toLowerCase() === "x" ? parseInt(O.slice(2), 16) : parseInt(O.slice(1), 10), c(N)) ? a(N) : b;
	}
	function k(b) {
		return b.indexOf("\\") < 0 ? b : b.replace(l, "$1");
	}
	function A(b) {
		return b.indexOf("\\") < 0 && b.indexOf("&") < 0 ? b : b.replace(h, function (O, N, d) {
			return N || g(O, d);
		});
	}
	var y = /[&<>"]/, m = /[&<>"]/g, w = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;"
	};
	function C(b) {
		return w[b];
	}
	function q(b) {
		return y.test(b) ? b.replace(m, C) : b;
	}
	var _ = /[.?*+^$[\]\\(){}|-]/g;
	function M(b) {
		return b.replace(_, "\\$&");
	}
	function $(b) {
		switch (b) {
			case 9:
			case 32:
				return !0;
		}
		return !1;
	}
	function G(b) {
		if (b >= 8192 && b <= 8202)
			return !0;
		switch (b) {
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 32:
			case 160:
			case 5760:
			case 8239:
			case 8287:
			case 12288:
				return !0;
		}
		return !1;
	}
	var R = Vn;
	function P(b) {
		return R.test(b);
	}
	function fe(b) {
		switch (b) {
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 45:
			case 46:
			case 47:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 123:
			case 124:
			case 125:
			case 126:
				return !0;
			default:
				return !1;
		}
	}
	function oe(b) {
		return b = b.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (b = b.replace(/ẞ/g, "ß")), b.toLowerCase().toUpperCase();
	}
	n.lib = {}, n.lib.mdurl = Te, n.lib.ucmicro = p$(), n.assign = s, n.isString = t, n.has = o, n.unescapeMd = k, n.unescapeAll = A, n.isValidEntityCode = c, n.fromCodePoint = a, n.escapeHtml = q, n.arrayReplaceAt = i, n.isSpace = $, n.isWhiteSpace = G, n.isMdAsciiPunct = fe, n.isPunctChar = P, n.escapeRE = M, n.normalizeReference = oe;
})(F);
var an = {}, h$ = function (e, t, r) {
	var o, s, i, c, a = -1, l = e.posMax, u = e.pos;
	for (e.pos = t + 1, o = 1; e.pos < l;) {
		if (i = e.src.charCodeAt(e.pos), i === 93 && (o--, o === 0)) {
			s = !0;
			break;
		}
		if (c = e.pos, e.md.inline.skipToken(e), i === 91) {
			if (c === e.pos - 1)
				o++;
			else if (r)
				return e.pos = u, -1;
		}
	}
	return s && (a = e.pos), e.pos = u, a;
}, Dt = F.unescapeAll, d$ = function (e, t, r) {
	var o, s, i = 0, c = t, a = {
		ok: !1,
		pos: 0,
		lines: 0,
		str: ""
	};
	if (e.charCodeAt(t) === 60) {
		for (t++; t < r;) {
			if (o = e.charCodeAt(t), o === 10 || o === 60)
				return a;
			if (o === 62)
				return a.pos = t + 1, a.str = Dt(e.slice(c + 1, t)), a.ok = !0, a;
			if (o === 92 && t + 1 < r) {
				t += 2;
				continue;
			}
			t++;
		}
		return a;
	}
	for (s = 0; t < r && (o = e.charCodeAt(t), !(o === 32 || o < 32 || o === 127));) {
		if (o === 92 && t + 1 < r) {
			if (e.charCodeAt(t + 1) === 32)
				break;
			t += 2;
			continue;
		}
		if (o === 40 && (s++, s > 32))
			return a;
		if (o === 41) {
			if (s === 0)
				break;
			s--;
		}
		t++;
	}
	return c === t || s !== 0 || (a.str = Dt(e.slice(c, t)), a.lines = i, a.pos = t, a.ok = !0), a;
}, g$ = F.unescapeAll, m$ = function (e, t, r) {
	var o, s, i = 0, c = t, a = {
		ok: !1,
		pos: 0,
		lines: 0,
		str: ""
	};
	if (t >= r || (s = e.charCodeAt(t), s !== 34 && s !== 39 && s !== 40))
		return a;
	for (t++, s === 40 && (s = 41); t < r;) {
		if (o = e.charCodeAt(t), o === s)
			return a.pos = t + 1, a.lines = i, a.str = g$(e.slice(c + 1, t)), a.ok = !0, a;
		if (o === 40 && s === 41)
			return a;
		o === 10 ? i++ : o === 92 && t + 1 < r && (t++, e.charCodeAt(t) === 10 && i++), t++;
	}
	return a;
};
an.parseLinkLabel = h$;
an.parseLinkDestination = d$;
an.parseLinkTitle = m$;
var b$ = F.assign, _$ = F.unescapeAll, ye = F.escapeHtml, le = {};
le.code_inline = function (n, e, t, r, o) {
	var s = n[e];
	return "<code" + o.renderAttrs(s) + ">" + ye(n[e].content) + "</code>";
};
le.code_block = function (n, e, t, r, o) {
	var s = n[e];
	return "<pre" + o.renderAttrs(s) + "><code>" + ye(n[e].content) + `</code></pre>
`;
};
le.fence = function (n, e, t, r, o) {
	var s = n[e], i = s.info ? _$(s.info).trim() : "", c = "", a = "", l, u, h, f, p;
	return i && (h = i.split(/(\s+)/g), c = h[0], a = h.slice(2).join("")), t.highlight ? l = t.highlight(s.content, c, a) || ye(s.content) : l = ye(s.content), l.indexOf("<pre") === 0 ? l + `
` : i ? (u = s.attrIndex("class"), f = s.attrs ? s.attrs.slice() : [], u < 0 ? f.push(["class", t.langPrefix + c]) : (f[u] = f[u].slice(), f[u][1] += " " + t.langPrefix + c), p = {
		attrs: f
	}, "<pre><code" + o.renderAttrs(p) + ">" + l + `</code></pre>
`) : "<pre><code" + o.renderAttrs(s) + ">" + l + `</code></pre>
`;
};
le.image = function (n, e, t, r, o) {
	var s = n[e];
	return s.attrs[s.attrIndex("alt")][1] = o.renderInlineAsText(s.children, t, r), o.renderToken(n, e, t);
};
le.hardbreak = function (n, e, t) {
	return t.xhtmlOut ? `<br />
` : `<br>
`;
};
le.softbreak = function (n, e, t) {
	return t.breaks ? t.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
le.text = function (n, e) {
	return ye(n[e].content);
};
le.html_block = function (n, e) {
	return n[e].content;
};
le.html_inline = function (n, e) {
	return n[e].content;
};
function Re() {
	this.rules = b$({}, le);
}
Re.prototype.renderAttrs = function (e) {
	var t, r, o;
	if (!e.attrs)
		return "";
	for (o = "", t = 0, r = e.attrs.length; t < r; t++)
		o += " " + ye(e.attrs[t][0]) + '="' + ye(e.attrs[t][1]) + '"';
	return o;
};
Re.prototype.renderToken = function (e, t, r) {
	var o, s = "", i = !1, c = e[t];
	return c.hidden ? "" : (c.block && c.nesting !== -1 && t && e[t - 1].hidden && (s += `
`), s += (c.nesting === -1 ? "</" : "<") + c.tag, s += this.renderAttrs(c), c.nesting === 0 && r.xhtmlOut && (s += " /"), c.block && (i = !0, c.nesting === 1 && t + 1 < e.length && (o = e[t + 1], (o.type === "inline" || o.hidden || o.nesting === -1 && o.tag === c.tag) && (i = !1))), s += i ? `>
` : ">", s);
};
Re.prototype.renderInline = function (n, e, t) {
	for (var r, o = "", s = this.rules, i = 0, c = n.length; i < c; i++)
		r = n[i].type, typeof s[r] < "u" ? o += s[r](n, i, e, t, this) : o += this.renderToken(n, i, e);
	return o;
};
Re.prototype.renderInlineAsText = function (n, e, t) {
	for (var r = "", o = 0, s = n.length; o < s; o++)
		n[o].type === "text" ? r += n[o].content : n[o].type === "image" ? r += this.renderInlineAsText(n[o].children, e, t) : n[o].type === "softbreak" && (r += `
`);
	return r;
};
Re.prototype.render = function (n, e, t) {
	var r, o, s, i = "", c = this.rules;
	for (r = 0, o = n.length; r < o; r++)
		s = n[r].type, s === "inline" ? i += this.renderInline(n[r].children, e, t) : typeof c[s] < "u" ? i += c[n[r].type](n, r, e, t, this) : i += this.renderToken(n, r, e, t);
	return i;
};
var k$ = Re;
function re() {
	this.__rules__ = [], this.__cache__ = null;
}
re.prototype.__find__ = function (n) {
	for (var e = 0; e < this.__rules__.length; e++)
		if (this.__rules__[e].name === n)
			return e;
	return -1;
};
re.prototype.__compile__ = function () {
	var n = this, e = [""];
	n.__rules__.forEach(function (t) {
		t.enabled && t.alt.forEach(function (r) {
			e.indexOf(r) < 0 && e.push(r);
		});
	}), n.__cache__ = {}, e.forEach(function (t) {
		n.__cache__[t] = [], n.__rules__.forEach(function (r) {
			r.enabled && (t && r.alt.indexOf(t) < 0 || n.__cache__[t].push(r.fn));
		});
	});
};
re.prototype.at = function (n, e, t) {
	var r = this.__find__(n), o = t || {};
	if (r === -1)
		throw new Error("Parser rule not found: " + n);
	this.__rules__[r].fn = e, this.__rules__[r].alt = o.alt || [], this.__cache__ = null;
};
re.prototype.before = function (n, e, t, r) {
	var o = this.__find__(n), s = r || {};
	if (o === -1)
		throw new Error("Parser rule not found: " + n);
	this.__rules__.splice(o, 0, {
		name: e,
		enabled: !0,
		fn: t,
		alt: s.alt || []
	}), this.__cache__ = null;
};
re.prototype.after = function (n, e, t, r) {
	var o = this.__find__(n), s = r || {};
	if (o === -1)
		throw new Error("Parser rule not found: " + n);
	this.__rules__.splice(o + 1, 0, {
		name: e,
		enabled: !0,
		fn: t,
		alt: s.alt || []
	}), this.__cache__ = null;
};
re.prototype.push = function (n, e, t) {
	var r = t || {};
	this.__rules__.push({
		name: n,
		enabled: !0,
		fn: e,
		alt: r.alt || []
	}), this.__cache__ = null;
};
re.prototype.enable = function (n, e) {
	Array.isArray(n) || (n = [n]);
	var t = [];
	return n.forEach(function (r) {
		var o = this.__find__(r);
		if (o < 0) {
			if (e)
				return;
			throw new Error("Rules manager: invalid rule name " + r);
		}
		this.__rules__[o].enabled = !0, t.push(r);
	}, this), this.__cache__ = null, t;
};
re.prototype.enableOnly = function (n, e) {
	Array.isArray(n) || (n = [n]), this.__rules__.forEach(function (t) {
		t.enabled = !1;
	}), this.enable(n, e);
};
re.prototype.disable = function (n, e) {
	Array.isArray(n) || (n = [n]);
	var t = [];
	return n.forEach(function (r) {
		var o = this.__find__(r);
		if (o < 0) {
			if (e)
				return;
			throw new Error("Rules manager: invalid rule name " + r);
		}
		this.__rules__[o].enabled = !1, t.push(r);
	}, this), this.__cache__ = null, t;
};
re.prototype.getRules = function (n) {
	return this.__cache__ === null && this.__compile__(), this.__cache__[n] || [];
};
var Hn = re, v$ = /\r\n?|\n/g, x$ = /\0/g, y$ = function (e) {
	var t;
	t = e.src.replace(v$, `
`), t = t.replace(x$, "�"), e.src = t;
}, w$ = function (e) {
	var t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}, E$ = function (e) {
	var t = e.tokens, r, o, s;
	for (o = 0, s = t.length; o < s; o++)
		r = t[o], r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
}, A$ = F.arrayReplaceAt;
function C$(n) {
	return /^<a[>\s]/i.test(n);
}
function S$(n) {
	return /^<\/a\s*>/i.test(n);
}
var D$ = function (e) {
	var t, r, o, s, i, c, a, l, u, h, f, p, g, k, A, y, m = e.tokens, w;
	if (e.md.options.linkify) {
		for (r = 0, o = m.length; r < o; r++)
			if (!(m[r].type !== "inline" || !e.md.linkify.pretest(m[r].content)))
				for (s = m[r].children, g = 0, t = s.length - 1; t >= 0; t--) {
					if (c = s[t], c.type === "link_close") {
						for (t--; s[t].level !== c.level && s[t].type !== "link_open";)
							t--;
						continue;
					}
					if (c.type === "html_inline" && (C$(c.content) && g > 0 && g--, S$(c.content) && g++), !(g > 0) && c.type === "text" && e.md.linkify.test(c.content)) {
						for (u = c.content, w = e.md.linkify.match(u), a = [], p = c.level, f = 0, l = 0; l < w.length; l++)
							k = w[l].url, A = e.md.normalizeLink(k), e.md.validateLink(A) && (y = w[l].text, w[l].schema ? w[l].schema === "mailto:" && !/^mailto:/i.test(y) ? y = e.md.normalizeLinkText("mailto:" + y).replace(/^mailto:/, "") : y = e.md.normalizeLinkText(y) : y = e.md.normalizeLinkText("http://" + y).replace(/^http:\/\//, ""), h = w[l].index, h > f && (i = new e.Token("text", "", 0), i.content = u.slice(f, h), i.level = p, a.push(i)), i = new e.Token("link_open", "a", 1), i.attrs = [["href", A]], i.level = p++, i.markup = "linkify", i.info = "auto", a.push(i), i = new e.Token("text", "", 0), i.content = y, i.level = p, a.push(i), i = new e.Token("link_close", "a", -1), i.level = --p, i.markup = "linkify", i.info = "auto", a.push(i), f = w[l].lastIndex);
						f < u.length && (i = new e.Token("text", "", 0), i.content = u.slice(f), i.level = p, a.push(i)), m[r].children = s = A$(s, t, a);
					}
				}
	}
}, Sr = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, q$ = /\((c|tm|r|p)\)/i, T$ = /\((c|tm|r|p)\)/ig, R$ = {
	c: "©",
	r: "®",
	p: "§",
	tm: "™"
};
function N$(n, e) {
	return R$[e.toLowerCase()];
}
function M$(n) {
	var e, t, r = 0;
	for (e = n.length - 1; e >= 0; e--)
		t = n[e], t.type === "text" && !r && (t.content = t.content.replace(T$, N$)), t.type === "link_open" && t.info === "auto" && r--, t.type === "link_close" && t.info === "auto" && r++;
}
function L$(n) {
	var e, t, r = 0;
	for (e = n.length - 1; e >= 0; e--)
		t = n[e], t.type === "text" && !r && Sr.test(t.content) && (t.content = t.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), t.type === "link_open" && t.info === "auto" && r--, t.type === "link_close" && t.info === "auto" && r++;
}
var I$ = function (e) {
	var t;
	if (e.md.options.typographer)
		for (t = e.tokens.length - 1; t >= 0; t--)
			e.tokens[t].type === "inline" && (q$.test(e.tokens[t].content) && M$(e.tokens[t].children), Sr.test(e.tokens[t].content) && L$(e.tokens[t].children));
}, qt = F.isWhiteSpace, Tt = F.isPunctChar, Rt = F.isMdAsciiPunct, F$ = /['"]/, Nt = /['"]/g, Mt = "’";
function We(n, e, t) {
	return n.substr(0, e) + t + n.substr(e + 1);
}
function O$(n, e) {
	var t, r, o, s, i, c, a, l, u, h, f, p, g, k, A, y, m, w, C, q, _;
	for (C = [], t = 0; t < n.length; t++) {
		for (r = n[t], a = n[t].level, m = C.length - 1; m >= 0 && !(C[m].level <= a); m--)
			;
		if (C.length = m + 1, r.type === "text") {
			o = r.content, i = 0, c = o.length;
			e:
			for (; i < c && (Nt.lastIndex = i, s = Nt.exec(o), !!s);) {
				if (A = y = !0, i = s.index + 1, w = s[0] === "'", u = 32, s.index - 1 >= 0)
					u = o.charCodeAt(s.index - 1);
				else
					for (m = t - 1; m >= 0 && !(n[m].type === "softbreak" || n[m].type === "hardbreak"); m--)
						if (n[m].content) {
							u = n[m].content.charCodeAt(n[m].content.length - 1);
							break;
						}
				if (h = 32, i < c)
					h = o.charCodeAt(i);
				else
					for (m = t + 1; m < n.length && !(n[m].type === "softbreak" || n[m].type === "hardbreak"); m++)
						if (n[m].content) {
							h = n[m].content.charCodeAt(0);
							break;
						}
				if (f = Rt(u) || Tt(String.fromCharCode(u)), p = Rt(h) || Tt(String.fromCharCode(h)), g = qt(u), k = qt(h), k ? A = !1 : p && (g || f || (A = !1)), g ? y = !1 : f && (k || p || (y = !1)), h === 34 && s[0] === '"' && u >= 48 && u <= 57 && (y = A = !1), A && y && (A = f, y = p), !A && !y) {
					w && (r.content = We(r.content, s.index, Mt));
					continue;
				}
				if (y) {
					for (m = C.length - 1; m >= 0 && (l = C[m], !(C[m].level < a)); m--)
						if (l.single === w && C[m].level === a) {
							l = C[m], w ? (q = e.md.options.quotes[2], _ = e.md.options.quotes[3]) : (q = e.md.options.quotes[0], _ = e.md.options.quotes[1]), r.content = We(r.content, s.index, _), n[l.token].content = We(
								n[l.token].content,
								l.pos,
								q
							), i += _.length - 1, l.token === t && (i += q.length - 1), o = r.content, c = o.length, C.length = m;
							continue e;
						}
				}
				A ? C.push({
					token: t,
					pos: s.index,
					single: w,
					level: a
				}) : y && w && (r.content = We(r.content, s.index, Mt));
			}
		}
	}
}
var B$ = function (e) {
	var t;
	if (e.md.options.typographer)
		for (t = e.tokens.length - 1; t >= 0; t--)
			e.tokens[t].type !== "inline" || !F$.test(e.tokens[t].content) || O$(e.tokens[t].children, e);
};
function Ne(n, e, t) {
	this.type = n, this.tag = e, this.attrs = null, this.map = null, this.nesting = t, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
Ne.prototype.attrIndex = function (e) {
	var t, r, o;
	if (!this.attrs)
		return -1;
	for (t = this.attrs, r = 0, o = t.length; r < o; r++)
		if (t[r][0] === e)
			return r;
	return -1;
};
Ne.prototype.attrPush = function (e) {
	this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
Ne.prototype.attrSet = function (e, t) {
	var r = this.attrIndex(e), o = [e, t];
	r < 0 ? this.attrPush(o) : this.attrs[r] = o;
};
Ne.prototype.attrGet = function (e) {
	var t = this.attrIndex(e), r = null;
	return t >= 0 && (r = this.attrs[t][1]), r;
};
Ne.prototype.attrJoin = function (e, t) {
	var r = this.attrIndex(e);
	r < 0 ? this.attrPush([e, t]) : this.attrs[r][1] = this.attrs[r][1] + " " + t;
};
var Gn = Ne, P$ = Gn;
function Dr(n, e, t) {
	this.src = n, this.env = t, this.tokens = [], this.inlineMode = !1, this.md = e;
}
Dr.prototype.Token = P$;
var z$ = Dr, $$ = Hn, wn = [
	["normalize", y$],
	["block", w$],
	["inline", E$],
	["linkify", D$],
	["replacements", I$],
	["smartquotes", B$]
];
function jn() {
	this.ruler = new $$();
	for (var n = 0; n < wn.length; n++)
		this.ruler.push(wn[n][0], wn[n][1]);
}
jn.prototype.process = function (n) {
	var e, t, r;
	for (r = this.ruler.getRules(""), e = 0, t = r.length; e < t; e++)
		r[e](n);
};
jn.prototype.State = z$;
var U$ = jn, En = F.isSpace;
function An(n, e) {
	var t = n.bMarks[e] + n.tShift[e], r = n.eMarks[e];
	return n.src.substr(t, r - t);
}
function Lt(n) {
	var e = [], t = 0, r = n.length, o, s = !1, i = 0, c = "";
	for (o = n.charCodeAt(t); t < r;)
		o === 124 && (s ? (c += n.substring(i, t - 1), i = t) : (e.push(c + n.substring(i, t)), c = "", i = t + 1)), s = o === 92, t++, o = n.charCodeAt(t);
	return e.push(c + n.substring(i)), e;
}
var V$ = function (e, t, r, o) {
	var s, i, c, a, l, u, h, f, p, g, k, A, y, m, w, C, q, _;
	if (t + 2 > r || (u = t + 1, e.sCount[u] < e.blkIndent) || e.sCount[u] - e.blkIndent >= 4 || (c = e.bMarks[u] + e.tShift[u], c >= e.eMarks[u]) || (q = e.src.charCodeAt(c++), q !== 124 && q !== 45 && q !== 58) || c >= e.eMarks[u] || (_ = e.src.charCodeAt(c++), _ !== 124 && _ !== 45 && _ !== 58 && !En(_)) || q === 45 && En(_))
		return !1;
	for (; c < e.eMarks[u];) {
		if (s = e.src.charCodeAt(c), s !== 124 && s !== 45 && s !== 58 && !En(s))
			return !1;
		c++;
	}
	for (i = An(e, t + 1), h = i.split("|"), g = [], a = 0; a < h.length; a++) {
		if (k = h[a].trim(), !k) {
			if (a === 0 || a === h.length - 1)
				continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(k))
			return !1;
		k.charCodeAt(k.length - 1) === 58 ? g.push(k.charCodeAt(0) === 58 ? "center" : "right") : k.charCodeAt(0) === 58 ? g.push("left") : g.push("");
	}
	if (i = An(e, t).trim(), i.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4 || (h = Lt(i), h.length && h[0] === "" && h.shift(), h.length && h[h.length - 1] === "" && h.pop(), f = h.length, f === 0 || f !== g.length))
		return !1;
	if (o)
		return !0;
	for (m = e.parentType, e.parentType = "table", C = e.md.block.ruler.getRules("blockquote"), p = e.push("table_open", "table", 1), p.map = A = [t, 0], p = e.push("thead_open", "thead", 1), p.map = [t, t + 1], p = e.push("tr_open", "tr", 1), p.map = [t, t + 1], a = 0; a < h.length; a++)
		p = e.push("th_open", "th", 1), g[a] && (p.attrs = [["style", "text-align:" + g[a]]]), p = e.push("inline", "", 0), p.content = h[a].trim(), p.children = [], p = e.push("th_close", "th", -1);
	for (p = e.push("tr_close", "tr", -1), p = e.push("thead_close", "thead", -1), u = t + 2; u < r && !(e.sCount[u] < e.blkIndent); u++) {
		for (w = !1, a = 0, l = C.length; a < l; a++)
			if (C[a](e, u, r, !0)) {
				w = !0;
				break;
			}
		if (w || (i = An(e, u).trim(), !i) || e.sCount[u] - e.blkIndent >= 4)
			break;
		for (h = Lt(i), h.length && h[0] === "" && h.shift(), h.length && h[h.length - 1] === "" && h.pop(), u === t + 2 && (p = e.push("tbody_open", "tbody", 1), p.map = y = [t + 2, 0]), p = e.push("tr_open", "tr", 1), p.map = [u, u + 1], a = 0; a < f; a++)
			p = e.push("td_open", "td", 1), g[a] && (p.attrs = [["style", "text-align:" + g[a]]]), p = e.push("inline", "", 0), p.content = h[a] ? h[a].trim() : "", p.children = [], p = e.push("td_close", "td", -1);
		p = e.push("tr_close", "tr", -1);
	}
	return y && (p = e.push("tbody_close", "tbody", -1), y[1] = u), p = e.push("table_close", "table", -1), A[1] = u, e.parentType = m, e.line = u, !0;
}, H$ = function (e, t, r) {
	var o, s, i;
	if (e.sCount[t] - e.blkIndent < 4)
		return !1;
	for (s = o = t + 1; o < r;) {
		if (e.isEmpty(o)) {
			o++;
			continue;
		}
		if (e.sCount[o] - e.blkIndent >= 4) {
			o++, s = o;
			continue;
		}
		break;
	}
	return e.line = s, i = e.push("code_block", "code", 0), i.content = e.getLines(t, s, 4 + e.blkIndent, !1) + `
`, i.map = [t, e.line], !0;
}, G$ = function (e, t, r, o) {
	var s, i, c, a, l, u, h, f = !1, p = e.bMarks[t] + e.tShift[t], g = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || p + 3 > g || (s = e.src.charCodeAt(p), s !== 126 && s !== 96) || (l = p, p = e.skipChars(p, s), i = p - l, i < 3) || (h = e.src.slice(l, p), c = e.src.slice(p, g), s === 96 && c.indexOf(String.fromCharCode(s)) >= 0))
		return !1;
	if (o)
		return !0;
	for (a = t; a++, !(a >= r || (p = l = e.bMarks[a] + e.tShift[a], g = e.eMarks[a], p < g && e.sCount[a] < e.blkIndent));)
		if (e.src.charCodeAt(p) === s && !(e.sCount[a] - e.blkIndent >= 4) && (p = e.skipChars(p, s), !(p - l < i) && (p = e.skipSpaces(p), !(p < g)))) {
			f = !0;
			break;
		}
	return i = e.sCount[t], e.line = a + (f ? 1 : 0), u = e.push("fence", "code", 0), u.info = c, u.content = e.getLines(t + 1, a, i, !0), u.markup = h, u.map = [t, e.line], !0;
}, It = F.isSpace, j$ = function (e, t, r, o) {
	var s, i, c, a, l, u, h, f, p, g, k, A, y, m, w, C, q, _, M, $, G = e.lineMax, R = e.bMarks[t] + e.tShift[t], P = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(R++) !== 62)
		return !1;
	if (o)
		return !0;
	for (a = p = e.sCount[t] + 1, e.src.charCodeAt(R) === 32 ? (R++, a++, p++, s = !1, C = !0) : e.src.charCodeAt(R) === 9 ? (C = !0, (e.bsCount[t] + p) % 4 === 3 ? (R++, a++, p++, s = !1) : s = !0) : C = !1, g = [e.bMarks[t]], e.bMarks[t] = R; R < P && (i = e.src.charCodeAt(R), It(i));) {
		i === 9 ? p += 4 - (p + e.bsCount[t] + (s ? 1 : 0)) % 4 : p++;
		R++;
	}
	for (k = [e.bsCount[t]], e.bsCount[t] = e.sCount[t] + 1 + (C ? 1 : 0), u = R >= P, m = [e.sCount[t]], e.sCount[t] = p - a, w = [e.tShift[t]], e.tShift[t] = R - e.bMarks[t], _ = e.md.block.ruler.getRules("blockquote"), y = e.parentType, e.parentType = "blockquote", f = t + 1; f < r && ($ = e.sCount[f] < e.blkIndent, R = e.bMarks[f] + e.tShift[f], P = e.eMarks[f], !(R >= P)); f++) {
		if (e.src.charCodeAt(R++) === 62 && !$) {
			for (a = p = e.sCount[f] + 1, e.src.charCodeAt(R) === 32 ? (R++, a++, p++, s = !1, C = !0) : e.src.charCodeAt(R) === 9 ? (C = !0, (e.bsCount[f] + p) % 4 === 3 ? (R++, a++, p++, s = !1) : s = !0) : C = !1, g.push(e.bMarks[f]), e.bMarks[f] = R; R < P && (i = e.src.charCodeAt(R), It(i));) {
				i === 9 ? p += 4 - (p + e.bsCount[f] + (s ? 1 : 0)) % 4 : p++;
				R++;
			}
			u = R >= P, k.push(e.bsCount[f]), e.bsCount[f] = e.sCount[f] + 1 + (C ? 1 : 0), m.push(e.sCount[f]), e.sCount[f] = p - a, w.push(e.tShift[f]), e.tShift[f] = R - e.bMarks[f];
			continue;
		}
		if (u)
			break;
		for (q = !1, c = 0, l = _.length; c < l; c++)
			if (_[c](e, f, r, !0)) {
				q = !0;
				break;
			}
		if (q) {
			e.lineMax = f, e.blkIndent !== 0 && (g.push(e.bMarks[f]), k.push(e.bsCount[f]), w.push(e.tShift[f]), m.push(e.sCount[f]), e.sCount[f] -= e.blkIndent);
			break;
		}
		g.push(e.bMarks[f]), k.push(e.bsCount[f]), w.push(e.tShift[f]), m.push(e.sCount[f]), e.sCount[f] = -1;
	}
	for (A = e.blkIndent, e.blkIndent = 0, M = e.push("blockquote_open", "blockquote", 1), M.markup = ">", M.map = h = [t, 0], e.md.block.tokenize(e, t, f), M = e.push("blockquote_close", "blockquote", -1), M.markup = ">", e.lineMax = G, e.parentType = y, h[1] = e.line, c = 0; c < w.length; c++)
		e.bMarks[c + t] = g[c], e.tShift[c + t] = w[c], e.sCount[c + t] = m[c], e.bsCount[c + t] = k[c];
	return e.blkIndent = A, !0;
}, Z$ = F.isSpace, W$ = function (e, t, r, o) {
	var s, i, c, a, l = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || (s = e.src.charCodeAt(l++), s !== 42 && s !== 45 && s !== 95))
		return !1;
	for (i = 1; l < u;) {
		if (c = e.src.charCodeAt(l++), c !== s && !Z$(c))
			return !1;
		c === s && i++;
	}
	return i < 3 ? !1 : (o || (e.line = t + 1, a = e.push("hr", "hr", 0), a.map = [t, e.line], a.markup = Array(i + 1).join(String.fromCharCode(s))), !0);
}, qr = F.isSpace;
function Ft(n, e) {
	var t, r, o, s;
	return r = n.bMarks[e] + n.tShift[e], o = n.eMarks[e], t = n.src.charCodeAt(r++), t !== 42 && t !== 45 && t !== 43 || r < o && (s = n.src.charCodeAt(r), !qr(s)) ? -1 : r;
}
function Ot(n, e) {
	var t, r = n.bMarks[e] + n.tShift[e], o = r, s = n.eMarks[e];
	if (o + 1 >= s || (t = n.src.charCodeAt(o++), t < 48 || t > 57))
		return -1;
	for (; ;) {
		if (o >= s)
			return -1;
		if (t = n.src.charCodeAt(o++), t >= 48 && t <= 57) {
			if (o - r >= 10)
				return -1;
			continue;
		}
		if (t === 41 || t === 46)
			break;
		return -1;
	}
	return o < s && (t = n.src.charCodeAt(o), !qr(t)) ? -1 : o;
}
function K$(n, e) {
	var t, r, o = n.level + 2;
	for (t = e + 2, r = n.tokens.length - 2; t < r; t++)
		n.tokens[t].level === o && n.tokens[t].type === "paragraph_open" && (n.tokens[t + 2].hidden = !0, n.tokens[t].hidden = !0, t += 2);
}
var J$ = function (e, t, r, o) {
	var s, i, c, a, l, u, h, f, p, g, k, A, y, m, w, C, q, _, M, $, G, R, P, fe, oe, b, O, N, d = !1, x = !0;
	if (e.sCount[t] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[t] - e.listIndent >= 4 && e.sCount[t] < e.blkIndent)
		return !1;
	if (o && e.parentType === "paragraph" && e.sCount[t] >= e.blkIndent && (d = !0), (P = Ot(e, t)) >= 0) {
		if (h = !0, oe = e.bMarks[t] + e.tShift[t], y = Number(e.src.slice(oe, P - 1)), d && y !== 1)
			return !1;
	} else if ((P = Ft(e, t)) >= 0)
		h = !1;
	else
		return !1;
	if (d && e.skipSpaces(P) >= e.eMarks[t])
		return !1;
	if (A = e.src.charCodeAt(P - 1), o)
		return !0;
	for (k = e.tokens.length, h ? (N = e.push("ordered_list_open", "ol", 1), y !== 1 && (N.attrs = [["start", y]])) : N = e.push("bullet_list_open", "ul", 1), N.map = g = [t, 0], N.markup = String.fromCharCode(A), w = t, fe = !1, O = e.md.block.ruler.getRules("list"), _ = e.parentType, e.parentType = "list"; w < r;) {
		for (R = P, m = e.eMarks[w], u = C = e.sCount[w] + P - (e.bMarks[t] + e.tShift[t]); R < m;) {
			if (s = e.src.charCodeAt(R), s === 9)
				C += 4 - (C + e.bsCount[w]) % 4;
			else if (s === 32)
				C++;
			else
				break;
			R++;
		}
		if (i = R, i >= m ? l = 1 : l = C - u, l > 4 && (l = 1), a = u + l, N = e.push("list_item_open", "li", 1), N.markup = String.fromCharCode(A), N.map = f = [t, 0], h && (N.info = e.src.slice(oe, P - 1)), G = e.tight, $ = e.tShift[t], M = e.sCount[t], q = e.listIndent, e.listIndent = e.blkIndent, e.blkIndent = a, e.tight = !0, e.tShift[t] = i - e.bMarks[t], e.sCount[t] = C, i >= m && e.isEmpty(t + 1) ? e.line = Math.min(e.line + 2, r) : e.md.block.tokenize(e, t, r, !0), (!e.tight || fe) && (x = !1), fe = e.line - t > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = q, e.tShift[t] = $, e.sCount[t] = M, e.tight = G, N = e.push("list_item_close", "li", -1), N.markup = String.fromCharCode(A), w = t = e.line, f[1] = w, i = e.bMarks[t], w >= r || e.sCount[w] < e.blkIndent || e.sCount[t] - e.blkIndent >= 4)
			break;
		for (b = !1, c = 0, p = O.length; c < p; c++)
			if (O[c](e, w, r, !0)) {
				b = !0;
				break;
			}
		if (b)
			break;
		if (h) {
			if (P = Ot(e, w), P < 0)
				break;
			oe = e.bMarks[w] + e.tShift[w];
		} else if (P = Ft(e, w), P < 0)
			break;
		if (A !== e.src.charCodeAt(P - 1))
			break;
	}
	return h ? N = e.push("ordered_list_close", "ol", -1) : N = e.push("bullet_list_close", "ul", -1), N.markup = String.fromCharCode(A), g[1] = w, e.line = w, e.parentType = _, x && K$(e, k), !0;
}, Y$ = F.normalizeReference, Ke = F.isSpace, X$ = function (e, t, r, o) {
	var s, i, c, a, l, u, h, f, p, g, k, A, y, m, w, C, q = 0, _ = e.bMarks[t] + e.tShift[t], M = e.eMarks[t], $ = t + 1;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(_) !== 91)
		return !1;
	for (; ++_ < M;)
		if (e.src.charCodeAt(_) === 93 && e.src.charCodeAt(_ - 1) !== 92) {
			if (_ + 1 === M || e.src.charCodeAt(_ + 1) !== 58)
				return !1;
			break;
		}
	for (a = e.lineMax, w = e.md.block.ruler.getRules("reference"), g = e.parentType, e.parentType = "reference"; $ < a && !e.isEmpty($); $++)
		if (!(e.sCount[$] - e.blkIndent > 3) && !(e.sCount[$] < 0)) {
			for (m = !1, u = 0, h = w.length; u < h; u++)
				if (w[u](e, $, a, !0)) {
					m = !0;
					break;
				}
			if (m)
				break;
		}
	for (y = e.getLines(t, $, e.blkIndent, !1).trim(), M = y.length, _ = 1; _ < M; _++) {
		if (s = y.charCodeAt(_), s === 91)
			return !1;
		if (s === 93) {
			p = _;
			break;
		} else
			s === 10 ? q++ : s === 92 && (_++, _ < M && y.charCodeAt(_) === 10 && q++);
	}
	if (p < 0 || y.charCodeAt(p + 1) !== 58)
		return !1;
	for (_ = p + 2; _ < M; _++)
		if (s = y.charCodeAt(_), s === 10)
			q++;
		else if (!Ke(s))
			break;
	if (k = e.md.helpers.parseLinkDestination(y, _, M), !k.ok || (l = e.md.normalizeLink(k.str), !e.md.validateLink(l)))
		return !1;
	for (_ = k.pos, q += k.lines, i = _, c = q, A = _; _ < M; _++)
		if (s = y.charCodeAt(_), s === 10)
			q++;
		else if (!Ke(s))
			break;
	for (k = e.md.helpers.parseLinkTitle(y, _, M), _ < M && A !== _ && k.ok ? (C = k.str, _ = k.pos, q += k.lines) : (C = "", _ = i, q = c); _ < M && (s = y.charCodeAt(_), !!Ke(s));)
		_++;
	if (_ < M && y.charCodeAt(_) !== 10 && C)
		for (C = "", _ = i, q = c; _ < M && (s = y.charCodeAt(_), !!Ke(s));)
			_++;
	return _ < M && y.charCodeAt(_) !== 10 || (f = Y$(y.slice(1, p)), !f) ? !1 : (o || (typeof e.env.references > "u" && (e.env.references = {}), typeof e.env.references[f] > "u" && (e.env.references[f] = { title: C, href: l }), e.parentType = g, e.line = t + q + 1), !0);
}, Q$ = [
	"address",
	"article",
	"aside",
	"base",
	"basefont",
	"blockquote",
	"body",
	"caption",
	"center",
	"col",
	"colgroup",
	"dd",
	"details",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hr",
	"html",
	"iframe",
	"legend",
	"li",
	"link",
	"main",
	"menu",
	"menuitem",
	"nav",
	"noframes",
	"ol",
	"optgroup",
	"option",
	"p",
	"param",
	"section",
	"source",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"title",
	"tr",
	"track",
	"ul"
], ln = {}, eU = "[a-zA-Z_:][a-zA-Z0-9:._-]*", nU = "[^\"'=<>`\\x00-\\x20]+", tU = "'[^']*'", rU = '"[^"]*"', oU = "(?:" + nU + "|" + tU + "|" + rU + ")", sU = "(?:\\s+" + eU + "(?:\\s*=\\s*" + oU + ")?)", Tr = "<[A-Za-z][A-Za-z0-9\\-]*" + sU + "*\\s*\\/?>", Rr = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", cU = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->", iU = "<[?][\\s\\S]*?[?]>", aU = "<![A-Z]+\\s+[^>]*>", lU = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", uU = new RegExp("^(?:" + Tr + "|" + Rr + "|" + cU + "|" + iU + "|" + aU + "|" + lU + ")"), fU = new RegExp("^(?:" + Tr + "|" + Rr + ")");
ln.HTML_TAG_RE = uU;
ln.HTML_OPEN_CLOSE_TAG_RE = fU;
var pU = Q$, hU = ln.HTML_OPEN_CLOSE_TAG_RE, Ae = [
	[/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
	[/^<!--/, /-->/, !0],
	[/^<\?/, /\?>/, !0],
	[/^<![A-Z]/, />/, !0],
	[/^<!\[CDATA\[/, /\]\]>/, !0],
	[new RegExp("^</?(" + pU.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
	[new RegExp(hU.source + "\\s*$"), /^$/, !1]
], dU = function (e, t, r, o) {
	var s, i, c, a, l = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(l) !== 60)
		return !1;
	for (a = e.src.slice(l, u), s = 0; s < Ae.length && !Ae[s][0].test(a); s++)
		;
	if (s === Ae.length)
		return !1;
	if (o)
		return Ae[s][2];
	if (i = t + 1, !Ae[s][1].test(a)) {
		for (; i < r && !(e.sCount[i] < e.blkIndent); i++)
			if (l = e.bMarks[i] + e.tShift[i], u = e.eMarks[i], a = e.src.slice(l, u), Ae[s][1].test(a)) {
				a.length !== 0 && i++;
				break;
			}
	}
	return e.line = i, c = e.push("html_block", "", 0), c.map = [t, i], c.content = e.getLines(t, i, e.blkIndent, !0), !0;
}, Bt = F.isSpace, gU = function (e, t, r, o) {
	var s, i, c, a, l = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || (s = e.src.charCodeAt(l), s !== 35 || l >= u))
		return !1;
	for (i = 1, s = e.src.charCodeAt(++l); s === 35 && l < u && i <= 6;)
		i++, s = e.src.charCodeAt(++l);
	return i > 6 || l < u && !Bt(s) ? !1 : (o || (u = e.skipSpacesBack(u, l), c = e.skipCharsBack(u, 35, l), c > l && Bt(e.src.charCodeAt(c - 1)) && (u = c), e.line = t + 1, a = e.push("heading_open", "h" + String(i), 1), a.markup = "########".slice(0, i), a.map = [t, e.line], a = e.push("inline", "", 0), a.content = e.src.slice(l, u).trim(), a.map = [t, e.line], a.children = [], a = e.push("heading_close", "h" + String(i), -1), a.markup = "########".slice(0, i)), !0);
}, mU = function (e, t, r) {
	var o, s, i, c, a, l, u, h, f, p = t + 1, g, k = e.md.block.ruler.getRules("paragraph");
	if (e.sCount[t] - e.blkIndent >= 4)
		return !1;
	for (g = e.parentType, e.parentType = "paragraph"; p < r && !e.isEmpty(p); p++)
		if (!(e.sCount[p] - e.blkIndent > 3)) {
			if (e.sCount[p] >= e.blkIndent && (l = e.bMarks[p] + e.tShift[p], u = e.eMarks[p], l < u && (f = e.src.charCodeAt(l), (f === 45 || f === 61) && (l = e.skipChars(l, f), l = e.skipSpaces(l), l >= u)))) {
				h = f === 61 ? 1 : 2;
				break;
			}
			if (!(e.sCount[p] < 0)) {
				for (s = !1, i = 0, c = k.length; i < c; i++)
					if (k[i](e, p, r, !0)) {
						s = !0;
						break;
					}
				if (s)
					break;
			}
		}
	return h ? (o = e.getLines(t, p, e.blkIndent, !1).trim(), e.line = p + 1, a = e.push("heading_open", "h" + String(h), 1), a.markup = String.fromCharCode(f), a.map = [t, e.line], a = e.push("inline", "", 0), a.content = o, a.map = [t, e.line - 1], a.children = [], a = e.push("heading_close", "h" + String(h), -1), a.markup = String.fromCharCode(f), e.parentType = g, !0) : !1;
}, bU = function (e, t) {
	var r, o, s, i, c, a, l = t + 1, u = e.md.block.ruler.getRules("paragraph"), h = e.lineMax;
	for (a = e.parentType, e.parentType = "paragraph"; l < h && !e.isEmpty(l); l++)
		if (!(e.sCount[l] - e.blkIndent > 3) && !(e.sCount[l] < 0)) {
			for (o = !1, s = 0, i = u.length; s < i; s++)
				if (u[s](e, l, h, !0)) {
					o = !0;
					break;
				}
			if (o)
				break;
		}
	return r = e.getLines(t, l, e.blkIndent, !1).trim(), e.line = l, c = e.push("paragraph_open", "p", 1), c.map = [t, e.line], c = e.push("inline", "", 0), c.content = r, c.map = [t, e.line], c.children = [], c = e.push("paragraph_close", "p", -1), e.parentType = a, !0;
}, Nr = Gn, un = F.isSpace;
function ue(n, e, t, r) {
	var o, s, i, c, a, l, u, h;
	for (this.src = n, this.md = e, this.env = t, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0, this.result = "", s = this.src, h = !1, i = c = l = u = 0, a = s.length; c < a; c++) {
		if (o = s.charCodeAt(c), !h)
			if (un(o)) {
				l++, o === 9 ? u += 4 - u % 4 : u++;
				continue;
			} else
				h = !0;
		(o === 10 || c === a - 1) && (o !== 10 && c++, this.bMarks.push(i), this.eMarks.push(c), this.tShift.push(l), this.sCount.push(u), this.bsCount.push(0), h = !1, l = 0, u = 0, i = c + 1);
	}
	this.bMarks.push(s.length), this.eMarks.push(s.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
ue.prototype.push = function (n, e, t) {
	var r = new Nr(n, e, t);
	return r.block = !0, t < 0 && this.level--, r.level = this.level, t > 0 && this.level++, this.tokens.push(r), r;
};
ue.prototype.isEmpty = function (e) {
	return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
ue.prototype.skipEmptyLines = function (e) {
	for (var t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
		;
	return e;
};
ue.prototype.skipSpaces = function (e) {
	for (var t, r = this.src.length; e < r && (t = this.src.charCodeAt(e), !!un(t)); e++)
		;
	return e;
};
ue.prototype.skipSpacesBack = function (e, t) {
	if (e <= t)
		return e;
	for (; e > t;)
		if (!un(this.src.charCodeAt(--e)))
			return e + 1;
	return e;
};
ue.prototype.skipChars = function (e, t) {
	for (var r = this.src.length; e < r && this.src.charCodeAt(e) === t; e++)
		;
	return e;
};
ue.prototype.skipCharsBack = function (e, t, r) {
	if (e <= r)
		return e;
	for (; e > r;)
		if (t !== this.src.charCodeAt(--e))
			return e + 1;
	return e;
};
ue.prototype.getLines = function (e, t, r, o) {
	var s, i, c, a, l, u, h, f = e;
	if (e >= t)
		return "";
	for (u = new Array(t - e), s = 0; f < t; f++, s++) {
		for (i = 0, h = a = this.bMarks[f], f + 1 < t || o ? l = this.eMarks[f] + 1 : l = this.eMarks[f]; a < l && i < r;) {
			if (c = this.src.charCodeAt(a), un(c))
				c === 9 ? i += 4 - (i + this.bsCount[f]) % 4 : i++;
			else if (a - h < this.tShift[f])
				i++;
			else
				break;
			a++;
		}
		i > r ? u[s] = new Array(i - r + 1).join(" ") + this.src.slice(a, l) : u[s] = this.src.slice(a, l);
	}
	return u.join("");
};
ue.prototype.Token = Nr;
var _U = ue, kU = Hn, Je = [
	// First 2 params - rule name & source. Secondary array - list of rules,
	// which can be terminated by this one.
	["table", V$, ["paragraph", "reference"]],
	["code", H$],
	["fence", G$, ["paragraph", "reference", "blockquote", "list"]],
	["blockquote", j$, ["paragraph", "reference", "blockquote", "list"]],
	["hr", W$, ["paragraph", "reference", "blockquote", "list"]],
	["list", J$, ["paragraph", "reference", "blockquote"]],
	["reference", X$],
	["html_block", dU, ["paragraph", "reference", "blockquote"]],
	["heading", gU, ["paragraph", "reference", "blockquote"]],
	["lheading", mU],
	["paragraph", bU]
];
function fn() {
	this.ruler = new kU();
	for (var n = 0; n < Je.length; n++)
		this.ruler.push(Je[n][0], Je[n][1], { alt: (Je[n][2] || []).slice() });
}
fn.prototype.tokenize = function (n, e, t) {
	for (var r, o, s = this.ruler.getRules(""), i = s.length, c = e, a = !1, l = n.md.options.maxNesting; c < t && (n.line = c = n.skipEmptyLines(c), !(c >= t || n.sCount[c] < n.blkIndent));) {
		if (n.level >= l) {
			n.line = t;
			break;
		}
		for (o = 0; o < i && (r = s[o](n, c, t, !1), !r); o++)
			;
		n.tight = !a, n.isEmpty(n.line - 1) && (a = !0), c = n.line, c < t && n.isEmpty(c) && (a = !0, c++, n.line = c);
	}
};
fn.prototype.parse = function (n, e, t, r) {
	var o;
	n && (o = new this.State(n, e, t, r), this.tokenize(o, o.line, o.lineMax));
};
fn.prototype.State = _U;
var vU = fn;
function xU(n) {
	switch (n) {
		case 10:
		case 33:
		case 35:
		case 36:
		case 37:
		case 38:
		case 42:
		case 43:
		case 45:
		case 58:
		case 60:
		case 61:
		case 62:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 125:
		case 126:
			return !0;
		default:
			return !1;
	}
}
var yU = function (e, t) {
	for (var r = e.pos; r < e.posMax && !xU(e.src.charCodeAt(r));)
		r++;
	return r === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, r)), e.pos = r, !0);
}, wU = F.isSpace, EU = function (e, t) {
	var r, o, s, i = e.pos;
	if (e.src.charCodeAt(i) !== 10)
		return !1;
	if (r = e.pending.length - 1, o = e.posMax, !t)
		if (r >= 0 && e.pending.charCodeAt(r) === 32)
			if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
				for (s = r - 1; s >= 1 && e.pending.charCodeAt(s - 1) === 32;)
					s--;
				e.pending = e.pending.slice(0, s), e.push("hardbreak", "br", 0);
			} else
				e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
		else
			e.push("softbreak", "br", 0);
	for (i++; i < o && wU(e.src.charCodeAt(i));)
		i++;
	return e.pos = i, !0;
}, AU = F.isSpace, Zn = [];
for (var Pt = 0; Pt < 256; Pt++)
	Zn.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function (n) {
	Zn[n.charCodeAt(0)] = 1;
});
var CU = function (e, t) {
	var r, o = e.pos, s = e.posMax;
	if (e.src.charCodeAt(o) !== 92)
		return !1;
	if (o++, o < s) {
		if (r = e.src.charCodeAt(o), r < 256 && Zn[r] !== 0)
			return t || (e.pending += e.src[o]), e.pos += 2, !0;
		if (r === 10) {
			for (t || e.push("hardbreak", "br", 0), o++; o < s && (r = e.src.charCodeAt(o), !!AU(r));)
				o++;
			return e.pos = o, !0;
		}
	}
	return t || (e.pending += "\\"), e.pos++, !0;
}, SU = function (e, t) {
	var r, o, s, i, c, a, l, u, h = e.pos, f = e.src.charCodeAt(h);
	if (f !== 96)
		return !1;
	for (r = h, h++, o = e.posMax; h < o && e.src.charCodeAt(h) === 96;)
		h++;
	if (s = e.src.slice(r, h), l = s.length, e.backticksScanned && (e.backticks[l] || 0) <= r)
		return t || (e.pending += s), e.pos += l, !0;
	for (c = a = h; (c = e.src.indexOf("`", a)) !== -1;) {
		for (a = c + 1; a < o && e.src.charCodeAt(a) === 96;)
			a++;
		if (u = a - c, u === l)
			return t || (i = e.push("code_inline", "code", 0), i.markup = s, i.content = e.src.slice(h, c).replace(/\n/g, " ").replace(/^ (.+) $/, "$1")), e.pos = a, !0;
		e.backticks[u] = c;
	}
	return e.backticksScanned = !0, t || (e.pending += s), e.pos += l, !0;
}, pn = {};
pn.tokenize = function (e, t) {
	var r, o, s, i, c, a = e.pos, l = e.src.charCodeAt(a);
	if (t || l !== 126 || (o = e.scanDelims(e.pos, !0), i = o.length, c = String.fromCharCode(l), i < 2))
		return !1;
	for (i % 2 && (s = e.push("text", "", 0), s.content = c, i--), r = 0; r < i; r += 2)
		s = e.push("text", "", 0), s.content = c + c, e.delimiters.push({
			marker: l,
			length: 0,
			// disable "rule of 3" length checks meant for emphasis
			token: e.tokens.length - 1,
			end: -1,
			open: o.can_open,
			close: o.can_close
		});
	return e.pos += o.length, !0;
};
function zt(n, e) {
	var t, r, o, s, i, c = [], a = e.length;
	for (t = 0; t < a; t++)
		o = e[t], o.marker === 126 && o.end !== -1 && (s = e[o.end], i = n.tokens[o.token], i.type = "s_open", i.tag = "s", i.nesting = 1, i.markup = "~~", i.content = "", i = n.tokens[s.token], i.type = "s_close", i.tag = "s", i.nesting = -1, i.markup = "~~", i.content = "", n.tokens[s.token - 1].type === "text" && n.tokens[s.token - 1].content === "~" && c.push(s.token - 1));
	for (; c.length;) {
		for (t = c.pop(), r = t + 1; r < n.tokens.length && n.tokens[r].type === "s_close";)
			r++;
		r--, t !== r && (i = n.tokens[r], n.tokens[r] = n.tokens[t], n.tokens[t] = i);
	}
}
pn.postProcess = function (e) {
	var t, r = e.tokens_meta, o = e.tokens_meta.length;
	for (zt(e, e.delimiters), t = 0; t < o; t++)
		r[t] && r[t].delimiters && zt(e, r[t].delimiters);
};
var hn = {};
hn.tokenize = function (e, t) {
	var r, o, s, i = e.pos, c = e.src.charCodeAt(i);
	if (t || c !== 95 && c !== 42)
		return !1;
	for (o = e.scanDelims(e.pos, c === 42), r = 0; r < o.length; r++)
		s = e.push("text", "", 0), s.content = String.fromCharCode(c), e.delimiters.push({
			// Char code of the starting marker (number).
			//
			marker: c,
			// Total length of these series of delimiters.
			//
			length: o.length,
			// A position of the token this delimiter corresponds to.
			//
			token: e.tokens.length - 1,
			// If this delimiter is matched as a valid opener, `end` will be
			// equal to its position, otherwise it's `-1`.
			//
			end: -1,
			// Boolean flags that determine if this delimiter could open or close
			// an emphasis.
			//
			open: o.can_open,
			close: o.can_close
		});
	return e.pos += o.length, !0;
};
function $t(n, e) {
	var t, r, o, s, i, c, a = e.length;
	for (t = a - 1; t >= 0; t--)
		r = e[t], !(r.marker !== 95 && r.marker !== 42) && r.end !== -1 && (o = e[r.end], c = t > 0 && e[t - 1].end === r.end + 1 && // check that first two markers match and adjacent
			e[t - 1].marker === r.marker && e[t - 1].token === r.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
			e[r.end + 1].token === o.token + 1, i = String.fromCharCode(r.marker), s = n.tokens[r.token], s.type = c ? "strong_open" : "em_open", s.tag = c ? "strong" : "em", s.nesting = 1, s.markup = c ? i + i : i, s.content = "", s = n.tokens[o.token], s.type = c ? "strong_close" : "em_close", s.tag = c ? "strong" : "em", s.nesting = -1, s.markup = c ? i + i : i, s.content = "", c && (n.tokens[e[t - 1].token].content = "", n.tokens[e[r.end + 1].token].content = "", t--));
}
hn.postProcess = function (e) {
	var t, r = e.tokens_meta, o = e.tokens_meta.length;
	for ($t(e, e.delimiters), t = 0; t < o; t++)
		r[t] && r[t].delimiters && $t(e, r[t].delimiters);
};
var DU = F.normalizeReference, Cn = F.isSpace, qU = function (e, t) {
	var r, o, s, i, c, a, l, u, h, f = "", p = "", g = e.pos, k = e.posMax, A = e.pos, y = !0;
	if (e.src.charCodeAt(e.pos) !== 91 || (c = e.pos + 1, i = e.md.helpers.parseLinkLabel(e, e.pos, !0), i < 0))
		return !1;
	if (a = i + 1, a < k && e.src.charCodeAt(a) === 40) {
		for (y = !1, a++; a < k && (o = e.src.charCodeAt(a), !(!Cn(o) && o !== 10)); a++)
			;
		if (a >= k)
			return !1;
		if (A = a, l = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), l.ok) {
			for (f = e.md.normalizeLink(l.str), e.md.validateLink(f) ? a = l.pos : f = "", A = a; a < k && (o = e.src.charCodeAt(a), !(!Cn(o) && o !== 10)); a++)
				;
			if (l = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < k && A !== a && l.ok)
				for (p = l.str, a = l.pos; a < k && (o = e.src.charCodeAt(a), !(!Cn(o) && o !== 10)); a++)
					;
		}
		(a >= k || e.src.charCodeAt(a) !== 41) && (y = !0), a++;
	}
	if (y) {
		if (typeof e.env.references > "u")
			return !1;
		if (a < k && e.src.charCodeAt(a) === 91 ? (A = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? s = e.src.slice(A, a++) : a = i + 1) : a = i + 1, s || (s = e.src.slice(c, i)), u = e.env.references[DU(s)], !u)
			return e.pos = g, !1;
		f = u.href, p = u.title;
	}
	return t || (e.pos = c, e.posMax = i, h = e.push("link_open", "a", 1), h.attrs = r = [["href", f]], p && r.push(["title", p]), e.md.inline.tokenize(e), h = e.push("link_close", "a", -1)), e.pos = a, e.posMax = k, !0;
}, TU = F.normalizeReference, Sn = F.isSpace, RU = function (e, t) {
	var r, o, s, i, c, a, l, u, h, f, p, g, k, A = "", y = e.pos, m = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91 || (a = e.pos + 2, c = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1), c < 0))
		return !1;
	if (l = c + 1, l < m && e.src.charCodeAt(l) === 40) {
		for (l++; l < m && (o = e.src.charCodeAt(l), !(!Sn(o) && o !== 10)); l++)
			;
		if (l >= m)
			return !1;
		for (k = l, h = e.md.helpers.parseLinkDestination(e.src, l, e.posMax), h.ok && (A = e.md.normalizeLink(h.str), e.md.validateLink(A) ? l = h.pos : A = ""), k = l; l < m && (o = e.src.charCodeAt(l), !(!Sn(o) && o !== 10)); l++)
			;
		if (h = e.md.helpers.parseLinkTitle(e.src, l, e.posMax), l < m && k !== l && h.ok)
			for (f = h.str, l = h.pos; l < m && (o = e.src.charCodeAt(l), !(!Sn(o) && o !== 10)); l++)
				;
		else
			f = "";
		if (l >= m || e.src.charCodeAt(l) !== 41)
			return e.pos = y, !1;
		l++;
	} else {
		if (typeof e.env.references > "u")
			return !1;
		if (l < m && e.src.charCodeAt(l) === 91 ? (k = l + 1, l = e.md.helpers.parseLinkLabel(e, l), l >= 0 ? i = e.src.slice(k, l++) : l = c + 1) : l = c + 1, i || (i = e.src.slice(a, c)), u = e.env.references[TU(i)], !u)
			return e.pos = y, !1;
		A = u.href, f = u.title;
	}
	return t || (s = e.src.slice(a, c), e.md.inline.parse(
		s,
		e.md,
		e.env,
		g = []
	), p = e.push("image", "img", 0), p.attrs = r = [["src", A], ["alt", ""]], p.children = g, p.content = s, f && r.push(["title", f])), e.pos = l, e.posMax = m, !0;
}, NU = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, MU = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/, LU = function (e, t) {
	var r, o, s, i, c, a, l = e.pos;
	if (e.src.charCodeAt(l) !== 60)
		return !1;
	for (c = e.pos, a = e.posMax; ;) {
		if (++l >= a || (i = e.src.charCodeAt(l), i === 60))
			return !1;
		if (i === 62)
			break;
	}
	return r = e.src.slice(c + 1, l), MU.test(r) ? (o = e.md.normalizeLink(r), e.md.validateLink(o) ? (t || (s = e.push("link_open", "a", 1), s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto", s = e.push("text", "", 0), s.content = e.md.normalizeLinkText(r), s = e.push("link_close", "a", -1), s.markup = "autolink", s.info = "auto"), e.pos += r.length + 2, !0) : !1) : NU.test(r) ? (o = e.md.normalizeLink("mailto:" + r), e.md.validateLink(o) ? (t || (s = e.push("link_open", "a", 1), s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto", s = e.push("text", "", 0), s.content = e.md.normalizeLinkText(r), s = e.push("link_close", "a", -1), s.markup = "autolink", s.info = "auto"), e.pos += r.length + 2, !0) : !1) : !1;
}, IU = ln.HTML_TAG_RE;
function FU(n) {
	var e = n | 32;
	return e >= 97 && e <= 122;
}
var OU = function (e, t) {
	var r, o, s, i, c = e.pos;
	return !e.md.options.html || (s = e.posMax, e.src.charCodeAt(c) !== 60 || c + 2 >= s) || (r = e.src.charCodeAt(c + 1), r !== 33 && r !== 63 && r !== 47 && !FU(r)) || (o = e.src.slice(c).match(IU), !o) ? !1 : (t || (i = e.push("html_inline", "", 0), i.content = e.src.slice(c, c + o[0].length)), e.pos += o[0].length, !0);
}, Ut = wr, BU = F.has, PU = F.isValidEntityCode, Vt = F.fromCodePoint, zU = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, $U = /^&([a-z][a-z0-9]{1,31});/i, UU = function (e, t) {
	var r, o, s, i = e.pos, c = e.posMax;
	if (e.src.charCodeAt(i) !== 38)
		return !1;
	if (i + 1 < c) {
		if (r = e.src.charCodeAt(i + 1), r === 35) {
			if (s = e.src.slice(i).match(zU), s)
				return t || (o = s[1][0].toLowerCase() === "x" ? parseInt(s[1].slice(1), 16) : parseInt(s[1], 10), e.pending += PU(o) ? Vt(o) : Vt(65533)), e.pos += s[0].length, !0;
		} else if (s = e.src.slice(i).match($U), s && BU(Ut, s[1]))
			return t || (e.pending += Ut[s[1]]), e.pos += s[0].length, !0;
	}
	return t || (e.pending += "&"), e.pos++, !0;
};
function Ht(n, e) {
	var t, r, o, s, i, c, a, l, u = {}, h = e.length;
	if (h) {
		var f = 0, p = -2, g = [];
		for (t = 0; t < h; t++)
			if (o = e[t], g.push(0), (e[f].marker !== o.marker || p !== o.token - 1) && (f = t), p = o.token, o.length = o.length || 0, !!o.close) {
				for (u.hasOwnProperty(o.marker) || (u[o.marker] = [-1, -1, -1, -1, -1, -1]), i = u[o.marker][(o.open ? 3 : 0) + o.length % 3], r = f - g[f] - 1, c = r; r > i; r -= g[r] + 1)
					if (s = e[r], s.marker === o.marker && s.open && s.end < 0 && (a = !1, (s.close || o.open) && (s.length + o.length) % 3 === 0 && (s.length % 3 !== 0 || o.length % 3 !== 0) && (a = !0), !a)) {
						l = r > 0 && !e[r - 1].open ? g[r - 1] + 1 : 0, g[t] = t - r + l, g[r] = l, o.open = !1, s.end = t, s.close = !1, c = -1, p = -2;
						break;
					}
				c !== -1 && (u[o.marker][(o.open ? 3 : 0) + (o.length || 0) % 3] = c);
			}
	}
}
var VU = function (e) {
	var t, r = e.tokens_meta, o = e.tokens_meta.length;
	for (Ht(e, e.delimiters), t = 0; t < o; t++)
		r[t] && r[t].delimiters && Ht(e, r[t].delimiters);
}, HU = function (e) {
	var t, r, o = 0, s = e.tokens, i = e.tokens.length;
	for (t = r = 0; t < i; t++)
		s[t].nesting < 0 && o--, s[t].level = o, s[t].nesting > 0 && o++, s[t].type === "text" && t + 1 < i && s[t + 1].type === "text" ? s[t + 1].content = s[t].content + s[t + 1].content : (t !== r && (s[r] = s[t]), r++);
	t !== r && (s.length = r);
}, Wn = Gn, Gt = F.isWhiteSpace, jt = F.isPunctChar, Zt = F.isMdAsciiPunct;
function Ue(n, e, t, r) {
	this.src = n, this.env = t, this.md = e, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1;
}
Ue.prototype.pushPending = function () {
	var n = new Wn("text", "", 0);
	return n.content = this.pending, n.level = this.pendingLevel, this.tokens.push(n), this.pending = "", n;
};
Ue.prototype.push = function (n, e, t) {
	this.pending && this.pushPending();
	var r = new Wn(n, e, t), o = null;
	return t < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, t > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], o = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(o), r;
};
Ue.prototype.scanDelims = function (n, e) {
	var t = n, r, o, s, i, c, a, l, u, h, f = !0, p = !0, g = this.posMax, k = this.src.charCodeAt(n);
	for (r = n > 0 ? this.src.charCodeAt(n - 1) : 32; t < g && this.src.charCodeAt(t) === k;)
		t++;
	return s = t - n, o = t < g ? this.src.charCodeAt(t) : 32, l = Zt(r) || jt(String.fromCharCode(r)), h = Zt(o) || jt(String.fromCharCode(o)), a = Gt(r), u = Gt(o), u ? f = !1 : h && (a || l || (f = !1)), a ? p = !1 : l && (u || h || (p = !1)), e ? (i = f, c = p) : (i = f && (!p || l), c = p && (!f || h)), {
		can_open: i,
		can_close: c,
		length: s
	};
};
Ue.prototype.Token = Wn;
var GU = Ue, Wt = Hn, Dn = [
	["text", yU],
	["newline", EU],
	["escape", CU],
	["backticks", SU],
	["strikethrough", pn.tokenize],
	["emphasis", hn.tokenize],
	["link", qU],
	["image", RU],
	["autolink", LU],
	["html_inline", OU],
	["entity", UU]
], qn = [
	["balance_pairs", VU],
	["strikethrough", pn.postProcess],
	["emphasis", hn.postProcess],
	["text_collapse", HU]
];
function Ve() {
	var n;
	for (this.ruler = new Wt(), n = 0; n < Dn.length; n++)
		this.ruler.push(Dn[n][0], Dn[n][1]);
	for (this.ruler2 = new Wt(), n = 0; n < qn.length; n++)
		this.ruler2.push(qn[n][0], qn[n][1]);
}
Ve.prototype.skipToken = function (n) {
	var e, t, r = n.pos, o = this.ruler.getRules(""), s = o.length, i = n.md.options.maxNesting, c = n.cache;
	if (typeof c[r] < "u") {
		n.pos = c[r];
		return;
	}
	if (n.level < i)
		for (t = 0; t < s && (n.level++, e = o[t](n, !0), n.level--, !e); t++)
			;
	else
		n.pos = n.posMax;
	e || n.pos++, c[r] = n.pos;
};
Ve.prototype.tokenize = function (n) {
	for (var e, t, r = this.ruler.getRules(""), o = r.length, s = n.posMax, i = n.md.options.maxNesting; n.pos < s;) {
		if (n.level < i)
			for (t = 0; t < o && (e = r[t](n, !1), !e); t++)
				;
		if (e) {
			if (n.pos >= s)
				break;
			continue;
		}
		n.pending += n.src[n.pos++];
	}
	n.pending && n.pushPending();
};
Ve.prototype.parse = function (n, e, t, r) {
	var o, s, i, c = new this.State(n, e, t, r);
	for (this.tokenize(c), s = this.ruler2.getRules(""), i = s.length, o = 0; o < i; o++)
		s[o](c);
};
Ve.prototype.State = GU;
var jU = Ve, Tn, Kt;
function ZU() {
	return Kt || (Kt = 1, Tn = function (n) {
		var e = {};
		e.src_Any = Er().source, e.src_Cc = Ar().source, e.src_Z = Cr().source, e.src_P = Vn.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
		var t = "[><｜]";
		return e.src_pseudo_letter = "(?:(?!" + t + "|" + e.src_ZPCc + ")" + e.src_Any + ")", e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?", e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = "(?=$|" + t + "|" + e.src_ZPCc + ")(?!-|_|:\\d|\\.-|\\.(?!$|" + e.src_ZPCc + "))", e.src_path = "(?:[/?#](?:(?!" + e.src_ZCc + "|" + t + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + e.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + e.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + e.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + e.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + e.src_ZCc + "|[']).)+\\'|\\'(?=" + e.src_pseudo_letter + "|[-]).|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + e.src_ZCc + "|[.]).|" + (n && n["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + e.src_ZCc + ").|;(?!" + e.src_ZCc + ").|\\!+(?!" + e.src_ZCc + "|[!]).|\\?(?!" + e.src_ZCc + "|[?]).)+|\\/)?", e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
			"(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})", e.src_domain = "(?:" + e.src_xn + "|(?:" + e.src_pseudo_letter + ")|(?:" + e.src_pseudo_letter + "(?:-|" + e.src_pseudo_letter + "){0,61}" + e.src_pseudo_letter + "))", e.src_host = "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))", e.tpl_host_fuzzy = "(?:" + e.src_ip4 + "|(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%)))", e.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))", e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + e.src_ZPCc + "|>|$))", e.tpl_email_fuzzy = "(^|" + t + '|"|\\(|' + e.src_ZCc + ")(" + e.src_email_name + "@" + e.tpl_host_fuzzy_strict + ")", e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
			// but can start with > (markdown blockquote)
			"(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_fuzzy_strict + e.src_path + ")", e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
			// but can start with > (markdown blockquote)
			"(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_no_ip_fuzzy_strict + e.src_path + ")", e;
	}), Tn;
}
function Ln(n) {
	var e = Array.prototype.slice.call(arguments, 1);
	return e.forEach(function (t) {
		t && Object.keys(t).forEach(function (r) {
			n[r] = t[r];
		});
	}), n;
}
function dn(n) {
	return Object.prototype.toString.call(n);
}
function WU(n) {
	return dn(n) === "[object String]";
}
function KU(n) {
	return dn(n) === "[object Object]";
}
function JU(n) {
	return dn(n) === "[object RegExp]";
}
function Jt(n) {
	return dn(n) === "[object Function]";
}
function YU(n) {
	return n.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var Mr = {
	fuzzyLink: !0,
	fuzzyEmail: !0,
	fuzzyIP: !1
};
function XU(n) {
	return Object.keys(n || {}).reduce(function (e, t) {
		return e || Mr.hasOwnProperty(t);
	}, !1);
}
var QU = {
	"http:": {
		validate: function (n, e, t) {
			var r = n.slice(e);
			return t.re.http || (t.re.http = new RegExp(
				"^\\/\\/" + t.re.src_auth + t.re.src_host_port_strict + t.re.src_path,
				"i"
			)), t.re.http.test(r) ? r.match(t.re.http)[0].length : 0;
		}
	},
	"https:": "http:",
	"ftp:": "http:",
	"//": {
		validate: function (n, e, t) {
			var r = n.slice(e);
			return t.re.no_http || (t.re.no_http = new RegExp(
				"^" + t.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
				// with code comments
				"(?:localhost|(?:(?:" + t.re.src_domain + ")\\.)+" + t.re.src_domain_root + ")" + t.re.src_port + t.re.src_host_terminator + t.re.src_path,
				"i"
			)), t.re.no_http.test(r) ? e >= 3 && n[e - 3] === ":" || e >= 3 && n[e - 3] === "/" ? 0 : r.match(t.re.no_http)[0].length : 0;
		}
	},
	"mailto:": {
		validate: function (n, e, t) {
			var r = n.slice(e);
			return t.re.mailto || (t.re.mailto = new RegExp(
				"^" + t.re.src_email_name + "@" + t.re.src_host_strict,
				"i"
			)), t.re.mailto.test(r) ? r.match(t.re.mailto)[0].length : 0;
		}
	}
}, e8 = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", n8 = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function t8(n) {
	n.__index__ = -1, n.__text_cache__ = "";
}
function r8(n) {
	return function (e, t) {
		var r = e.slice(t);
		return n.test(r) ? r.match(n)[0].length : 0;
	};
}
function Yt() {
	return function (n, e) {
		e.normalize(n);
	};
}
function tn(n) {
	var e = n.re = ZU()(n.__opts__), t = n.__tlds__.slice();
	n.onCompile(), n.__tlds_replaced__ || t.push(e8), t.push(e.src_xn), e.src_tlds = t.join("|");
	function r(c) {
		return c.replace("%TLDS%", e.src_tlds);
	}
	e.email_fuzzy = RegExp(r(e.tpl_email_fuzzy), "i"), e.link_fuzzy = RegExp(r(e.tpl_link_fuzzy), "i"), e.link_no_ip_fuzzy = RegExp(r(e.tpl_link_no_ip_fuzzy), "i"), e.host_fuzzy_test = RegExp(r(e.tpl_host_fuzzy_test), "i");
	var o = [];
	n.__compiled__ = {};
	function s(c, a) {
		throw new Error('(LinkifyIt) Invalid schema "' + c + '": ' + a);
	}
	Object.keys(n.__schemas__).forEach(function (c) {
		var a = n.__schemas__[c];
		if (a !== null) {
			var l = { validate: null, link: null };
			if (n.__compiled__[c] = l, KU(a)) {
				JU(a.validate) ? l.validate = r8(a.validate) : Jt(a.validate) ? l.validate = a.validate : s(c, a), Jt(a.normalize) ? l.normalize = a.normalize : a.normalize ? s(c, a) : l.normalize = Yt();
				return;
			}
			if (WU(a)) {
				o.push(c);
				return;
			}
			s(c, a);
		}
	}), o.forEach(function (c) {
		n.__compiled__[n.__schemas__[c]] && (n.__compiled__[c].validate = n.__compiled__[n.__schemas__[c]].validate, n.__compiled__[c].normalize = n.__compiled__[n.__schemas__[c]].normalize);
	}), n.__compiled__[""] = { validate: null, normalize: Yt() };
	var i = Object.keys(n.__compiled__).filter(function (c) {
		return c.length > 0 && n.__compiled__[c];
	}).map(YU).join("|");
	n.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "i"), n.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "ig"), n.re.pretest = RegExp(
		"(" + n.re.schema_test.source + ")|(" + n.re.host_fuzzy_test.source + ")|@",
		"i"
	), t8(n);
}
function o8(n, e) {
	var t = n.__index__, r = n.__last_index__, o = n.__text_cache__.slice(t, r);
	this.schema = n.__schema__.toLowerCase(), this.index = t + e, this.lastIndex = r + e, this.raw = o, this.text = o, this.url = o;
}
function Xt(n, e) {
	var t = new o8(n, e);
	return n.__compiled__[t.schema].normalize(t, n), t;
}
function Q(n, e) {
	if (!(this instanceof Q))
		return new Q(n, e);
	e || XU(n) && (e = n, n = {}), this.__opts__ = Ln({}, Mr, e), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = Ln({}, QU, n), this.__compiled__ = {}, this.__tlds__ = n8, this.__tlds_replaced__ = !1, this.re = {}, tn(this);
}
Q.prototype.add = function (e, t) {
	return this.__schemas__[e] = t, tn(this), this;
};
Q.prototype.set = function (e) {
	return this.__opts__ = Ln(this.__opts__, e), this;
};
Q.prototype.test = function (e) {
	if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
		return !1;
	var t, r, o, s, i, c, a, l, u;
	if (this.re.schema_test.test(e)) {
		for (a = this.re.schema_search, a.lastIndex = 0; (t = a.exec(e)) !== null;)
			if (s = this.testSchemaAt(e, t[2], a.lastIndex), s) {
				this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + s;
				break;
			}
	}
	return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (l = e.search(this.re.host_fuzzy_test), l >= 0 && (this.__index__ < 0 || l < this.__index__) && (r = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null && (i = r.index + r[1].length, (this.__index__ < 0 || i < this.__index__) && (this.__schema__ = "", this.__index__ = i, this.__last_index__ = r.index + r[0].length))), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && (u = e.indexOf("@"), u >= 0 && (o = e.match(this.re.email_fuzzy)) !== null && (i = o.index + o[1].length, c = o.index + o[0].length, (this.__index__ < 0 || i < this.__index__ || i === this.__index__ && c > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = i, this.__last_index__ = c))), this.__index__ >= 0;
};
Q.prototype.pretest = function (e) {
	return this.re.pretest.test(e);
};
Q.prototype.testSchemaAt = function (e, t, r) {
	return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, r, this) : 0;
};
Q.prototype.match = function (e) {
	var t = 0, r = [];
	this.__index__ >= 0 && this.__text_cache__ === e && (r.push(Xt(this, t)), t = this.__last_index__);
	for (var o = t ? e.slice(t) : e; this.test(o);)
		r.push(Xt(this, t)), o = o.slice(this.__last_index__), t += this.__last_index__;
	return r.length ? r : null;
};
Q.prototype.tlds = function (e, t) {
	return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function (r, o, s) {
		return r !== s[o - 1];
	}).reverse(), tn(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, tn(this), this);
};
Q.prototype.normalize = function (e) {
	e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
};
Q.prototype.onCompile = function () {
};
var s8 = Q;
const Se = 2147483647, ie = 36, Kn = 1, $e = 26, c8 = 38, i8 = 700, Lr = 72, Ir = 128, Fr = "-", a8 = /^xn--/, l8 = /[^\0-\x7F]/, u8 = /[\x2E\u3002\uFF0E\uFF61]/g, f8 = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, Rn = ie - Kn, ae = Math.floor, Nn = String.fromCharCode;
function he(n) {
	throw new RangeError(f8[n]);
}
function p8(n, e) {
	const t = [];
	let r = n.length;
	for (; r--;)
		t[r] = e(n[r]);
	return t;
}
function Or(n, e) {
	const t = n.split("@");
	let r = "";
	t.length > 1 && (r = t[0] + "@", n = t[1]), n = n.replace(u8, ".");
	const o = n.split("."), s = p8(o, e).join(".");
	return r + s;
}
function Jn(n) {
	const e = [];
	let t = 0;
	const r = n.length;
	for (; t < r;) {
		const o = n.charCodeAt(t++);
		if (o >= 55296 && o <= 56319 && t < r) {
			const s = n.charCodeAt(t++);
			(s & 64512) == 56320 ? e.push(((o & 1023) << 10) + (s & 1023) + 65536) : (e.push(o), t--);
		} else
			e.push(o);
	}
	return e;
}
const Br = (n) => String.fromCodePoint(...n), h8 = function (n) {
	return n >= 48 && n < 58 ? 26 + (n - 48) : n >= 65 && n < 91 ? n - 65 : n >= 97 && n < 123 ? n - 97 : ie;
}, Qt = function (n, e) {
	return n + 22 + 75 * (n < 26) - ((e != 0) << 5);
}, Pr = function (n, e, t) {
	let r = 0;
	for (n = t ? ae(n / i8) : n >> 1, n += ae(n / e); n > Rn * $e >> 1; r += ie)
		n = ae(n / Rn);
	return ae(r + (Rn + 1) * n / (n + c8));
}, Yn = function (n) {
	const e = [], t = n.length;
	let r = 0, o = Ir, s = Lr, i = n.lastIndexOf(Fr);
	i < 0 && (i = 0);
	for (let c = 0; c < i; ++c)
		n.charCodeAt(c) >= 128 && he("not-basic"), e.push(n.charCodeAt(c));
	for (let c = i > 0 ? i + 1 : 0; c < t;) {
		const a = r;
		for (let u = 1, h = ie; ; h += ie) {
			c >= t && he("invalid-input");
			const f = h8(n.charCodeAt(c++));
			f >= ie && he("invalid-input"), f > ae((Se - r) / u) && he("overflow"), r += f * u;
			const p = h <= s ? Kn : h >= s + $e ? $e : h - s;
			if (f < p)
				break;
			const g = ie - p;
			u > ae(Se / g) && he("overflow"), u *= g;
		}
		const l = e.length + 1;
		s = Pr(r - a, l, a == 0), ae(r / l) > Se - o && he("overflow"), o += ae(r / l), r %= l, e.splice(r++, 0, o);
	}
	return String.fromCodePoint(...e);
}, Xn = function (n) {
	const e = [];
	n = Jn(n);
	const t = n.length;
	let r = Ir, o = 0, s = Lr;
	for (const a of n)
		a < 128 && e.push(Nn(a));
	const i = e.length;
	let c = i;
	for (i && e.push(Fr); c < t;) {
		let a = Se;
		for (const u of n)
			u >= r && u < a && (a = u);
		const l = c + 1;
		a - r > ae((Se - o) / l) && he("overflow"), o += (a - r) * l, r = a;
		for (const u of n)
			if (u < r && ++o > Se && he("overflow"), u === r) {
				let h = o;
				for (let f = ie; ; f += ie) {
					const p = f <= s ? Kn : f >= s + $e ? $e : f - s;
					if (h < p)
						break;
					const g = h - p, k = ie - p;
					e.push(
						Nn(Qt(p + g % k, 0))
					), h = ae(g / k);
				}
				e.push(Nn(Qt(h, 0))), s = Pr(o, l, c === i), o = 0, ++c;
			}
		++o, ++r;
	}
	return e.join("");
}, zr = function (n) {
	return Or(n, function (e) {
		return a8.test(e) ? Yn(e.slice(4).toLowerCase()) : e;
	});
}, $r = function (n) {
	return Or(n, function (e) {
		return l8.test(e) ? "xn--" + Xn(e) : e;
	});
}, d8 = {
	/**
	 * A string representing the current Punycode.js version number.
	 * @memberOf punycode
	 * @type String
	 */
	version: "2.3.1",
	/**
	 * An object of methods to convert from JavaScript's internal character
	 * representation (UCS-2) to Unicode code points, and back.
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode
	 * @type Object
	 */
	ucs2: {
		decode: Jn,
		encode: Br
	},
	decode: Yn,
	encode: Xn,
	toASCII: $r,
	toUnicode: zr
}, g8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
	__proto__: null,
	decode: Yn,
	default: d8,
	encode: Xn,
	toASCII: $r,
	toUnicode: zr,
	ucs2decode: Jn,
	ucs2encode: Br
}, Symbol.toStringTag, { value: "Module" })), m8 = /* @__PURE__ */ ao(g8);
var b8 = {
	options: {
		html: !1,
		// Enable HTML tags in source
		xhtmlOut: !1,
		// Use '/' to close single tags (<br />)
		breaks: !1,
		// Convert '\n' in paragraphs into <br>
		langPrefix: "language-",
		// CSS language prefix for fenced blocks
		linkify: !1,
		// autoconvert URL-like texts to links
		// Enable some language-neutral replacements + quotes beautification
		typographer: !1,
		// Double + single quotes replacement pairs, when typographer enabled,
		// and smartquotes on. Could be either a String or an Array.
		//
		// For example, you can use '«»„“' for Russian, '„“‚‘' for German,
		// and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
		quotes: "“”‘’",
		/* “”‘’ */
		// Highlighter function. Should return escaped HTML,
		// or '' if the source string is not changed and should be escaped externaly.
		// If result starts with <pre... internal wrapper is skipped.
		//
		// function (/*str, lang*/) { return ''; }
		//
		highlight: null,
		maxNesting: 100
		// Internal protection, recursion limit
	},
	components: {
		core: {},
		block: {},
		inline: {}
	}
}, _8 = {
	options: {
		html: !1,
		// Enable HTML tags in source
		xhtmlOut: !1,
		// Use '/' to close single tags (<br />)
		breaks: !1,
		// Convert '\n' in paragraphs into <br>
		langPrefix: "language-",
		// CSS language prefix for fenced blocks
		linkify: !1,
		// autoconvert URL-like texts to links
		// Enable some language-neutral replacements + quotes beautification
		typographer: !1,
		// Double + single quotes replacement pairs, when typographer enabled,
		// and smartquotes on. Could be either a String or an Array.
		//
		// For example, you can use '«»„“' for Russian, '„“‚‘' for German,
		// and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
		quotes: "“”‘’",
		/* “”‘’ */
		// Highlighter function. Should return escaped HTML,
		// or '' if the source string is not changed and should be escaped externaly.
		// If result starts with <pre... internal wrapper is skipped.
		//
		// function (/*str, lang*/) { return ''; }
		//
		highlight: null,
		maxNesting: 20
		// Internal protection, recursion limit
	},
	components: {
		core: {
			rules: [
				"normalize",
				"block",
				"inline"
			]
		},
		block: {
			rules: [
				"paragraph"
			]
		},
		inline: {
			rules: [
				"text"
			],
			rules2: [
				"balance_pairs",
				"text_collapse"
			]
		}
	}
}, k8 = {
	options: {
		html: !0,
		// Enable HTML tags in source
		xhtmlOut: !0,
		// Use '/' to close single tags (<br />)
		breaks: !1,
		// Convert '\n' in paragraphs into <br>
		langPrefix: "language-",
		// CSS language prefix for fenced blocks
		linkify: !1,
		// autoconvert URL-like texts to links
		// Enable some language-neutral replacements + quotes beautification
		typographer: !1,
		// Double + single quotes replacement pairs, when typographer enabled,
		// and smartquotes on. Could be either a String or an Array.
		//
		// For example, you can use '«»„“' for Russian, '„“‚‘' for German,
		// and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
		quotes: "“”‘’",
		/* “”‘’ */
		// Highlighter function. Should return escaped HTML,
		// or '' if the source string is not changed and should be escaped externaly.
		// If result starts with <pre... internal wrapper is skipped.
		//
		// function (/*str, lang*/) { return ''; }
		//
		highlight: null,
		maxNesting: 20
		// Internal protection, recursion limit
	},
	components: {
		core: {
			rules: [
				"normalize",
				"block",
				"inline"
			]
		},
		block: {
			rules: [
				"blockquote",
				"code",
				"fence",
				"heading",
				"hr",
				"html_block",
				"lheading",
				"list",
				"reference",
				"paragraph"
			]
		},
		inline: {
			rules: [
				"autolink",
				"backticks",
				"emphasis",
				"entity",
				"escape",
				"html_inline",
				"image",
				"link",
				"newline",
				"text"
			],
			rules2: [
				"balance_pairs",
				"emphasis",
				"text_collapse"
			]
		}
	}
}, Oe = F, v8 = an, x8 = k$, y8 = U$, w8 = vU, E8 = jU, A8 = s8, be = Te, Ur = m8, C8 = {
	default: b8,
	zero: _8,
	commonmark: k8
}, S8 = /^(vbscript|javascript|file|data):/, D8 = /^data:image\/(gif|png|jpeg|webp);/;
function q8(n) {
	var e = n.trim().toLowerCase();
	return S8.test(e) ? !!D8.test(e) : !0;
}
var Vr = ["http:", "https:", "mailto:"];
function T8(n) {
	var e = be.parse(n, !0);
	if (e.hostname && (!e.protocol || Vr.indexOf(e.protocol) >= 0))
		try {
			e.hostname = Ur.toASCII(e.hostname);
		} catch {
		}
	return be.encode(be.format(e));
}
function R8(n) {
	var e = be.parse(n, !0);
	if (e.hostname && (!e.protocol || Vr.indexOf(e.protocol) >= 0))
		try {
			e.hostname = Ur.toUnicode(e.hostname);
		} catch {
		}
	return be.decode(be.format(e), be.decode.defaultChars + "%");
}
function ee(n, e) {
	if (!(this instanceof ee))
		return new ee(n, e);
	e || Oe.isString(n) || (e = n || {}, n = "default"), this.inline = new E8(), this.block = new w8(), this.core = new y8(), this.renderer = new x8(), this.linkify = new A8(), this.validateLink = q8, this.normalizeLink = T8, this.normalizeLinkText = R8, this.utils = Oe, this.helpers = Oe.assign({}, v8), this.options = {}, this.configure(n), e && this.set(e);
}
ee.prototype.set = function (n) {
	return Oe.assign(this.options, n), this;
};
ee.prototype.configure = function (n) {
	var e = this, t;
	if (Oe.isString(n) && (t = n, n = C8[t], !n))
		throw new Error('Wrong `markdown-it` preset "' + t + '", check name');
	if (!n)
		throw new Error("Wrong `markdown-it` preset, can't be empty");
	return n.options && e.set(n.options), n.components && Object.keys(n.components).forEach(function (r) {
		n.components[r].rules && e[r].ruler.enableOnly(n.components[r].rules), n.components[r].rules2 && e[r].ruler2.enableOnly(n.components[r].rules2);
	}), this;
};
ee.prototype.enable = function (n, e) {
	var t = [];
	Array.isArray(n) || (n = [n]), ["core", "block", "inline"].forEach(function (o) {
		t = t.concat(this[o].ruler.enable(n, !0));
	}, this), t = t.concat(this.inline.ruler2.enable(n, !0));
	var r = n.filter(function (o) {
		return t.indexOf(o) < 0;
	});
	if (r.length && !e)
		throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
	return this;
};
ee.prototype.disable = function (n, e) {
	var t = [];
	Array.isArray(n) || (n = [n]), ["core", "block", "inline"].forEach(function (o) {
		t = t.concat(this[o].ruler.disable(n, !0));
	}, this), t = t.concat(this.inline.ruler2.disable(n, !0));
	var r = n.filter(function (o) {
		return t.indexOf(o) < 0;
	});
	if (r.length && !e)
		throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
	return this;
};
ee.prototype.use = function (n) {
	var e = [this].concat(Array.prototype.slice.call(arguments, 1));
	return n.apply(n, e), this;
};
ee.prototype.parse = function (n, e) {
	if (typeof n != "string")
		throw new Error("Input data should be a String");
	var t = new this.core.State(n, this, e);
	return this.core.process(t), t.tokens;
};
ee.prototype.render = function (n, e) {
	return e = e || {}, this.renderer.render(this.parse(n, e), this.options, e);
};
ee.prototype.parseInline = function (n, e) {
	var t = new this.core.State(n, this, e);
	return t.inlineMode = !0, this.core.process(t), t.tokens;
};
ee.prototype.renderInline = function (n, e) {
	return e = e || {}, this.renderer.render(this.parseInline(n, e), this.options, e);
};
var N8 = ee, M8 = N8;
const L8 = /* @__PURE__ */ or(M8);
var I8 = te({
	name: "VueMarkdown",
	props: {
		source: {
			type: String,
			required: !0
		},
		options: {
			type: Object,
			required: !1
		}
	},
	data: function () {
		return {
			md: null
		};
	},
	computed: {
		content: function () {
			var n, e = this.source;
			return (n = this.md) === null || n === void 0 ? void 0 : n.render(e);
		}
	},
	created: function () {
		var n;
		this.md = new L8((n = this.options) !== null && n !== void 0 ? n : {});
	},
	render: function () {
		return to("div", { innerHTML: this.content });
	}
});
const F8 = I8, In = /* @__PURE__ */ te({
	__name: "Message",
	props: {
		message: {
			type: Object,
			required: !0
		}
	},
	setup(n) {
		const e = n, { message: t } = ro(e), r = De(() => t.value.text || "&lt;Empty response&gt;"), o = De(() => ({
			"chat-message-from-user": t.value.sender === "user",
			"chat-message-from-bot": t.value.sender === "bot"
		})), s = {
			highlight(i, c) {
				if (c && en.getLanguage(c))
					try {
						return en.highlight(i, { language: c }).value;
					} catch {
					}
				return "";
			}
		};
		return (i, c) => (I(), H("div", {
			class: tr(["chat-message", o.value])
		}, [
			Ie(i.$slots, "default", {}, () => [
				_e(V(F8), {
					class: "chat-message-markdown",
					source: r.value,
					options: s
				}, null, 8, ["source"])
			])
		], 2));
	}
}), O8 = /* @__PURE__ */ J("div", { class: "chat-message-typing-body" }, [
  /* @__PURE__ */ J("span", { class: "chat-message-typing-circle" }),
  /* @__PURE__ */ J("span", { class: "chat-message-typing-circle" }),
  /* @__PURE__ */ J("span", { class: "chat-message-typing-circle" })
], -1), B8 = /* @__PURE__ */ te({
	__name: "MessageTyping",
	props: {
		animation: {
			type: String,
			default: "bouncing"
		}
	},
	setup(n) {
		const e = n, t = {
			id: "typing",
			text: "",
			sender: "bot",
			createdAt: ""
		}, r = De(() => ({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			"chat-message-typing": !0,
			[`chat-message-typing-animation-${e.animation}`]: !0
		}));
		return (o, s) => (I(), X(V(In), {
			class: tr(r.value),
			message: t
		}, {
			default: ke(() => [
				O8
			]),
			_: 1
		}, 8, ["class"]));
	}
}), P8 = { class: "chat-messages-list" }, z8 = /* @__PURE__ */ te({
	__name: "MessagesList",
	props: {
		messages: {
			type: Array,
			required: !0
		}
	},
	setup(n) {
		const e = $n(), { initialMessages: t, waitingForResponse: r } = e;
		return (o, s) => (I(), H("div", P8, [
			(I(!0), H(ot, null, st(V(t), (i) => (I(), X(In, {
				key: i.id,
				message: i
			}, null, 8, ["message"]))), 128)),
			(I(!0), H(ot, null, st(n.messages, (i) => (I(), X(In, {
				key: i.id,
				message: i
			}, null, 8, ["message"]))), 128)),
			V(r) ? (I(), X(B8, { key: 0 })) : Fe("", !0)
		]));
	}
}), $8 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
}, U8 = /* @__PURE__ */ J("path", {
	fill: "currentColor",
	d: "m2 21l21-9L2 3v7l15 2l-15 2z"
}, null, -1), V8 = [
	U8
];
function H8(n, e) {
	return I(), H("svg", $8, [...V8]);
}
const G8 = { name: "mdi-send", render: H8 }, j8 = { class: "chat-input" }, Z8 = ["placeholder", "onKeydown"], W8 = ["disabled"], K8 = /* @__PURE__ */ te({
	__name: "Input",
	setup(n) {
		const e = $n(), { waitingForResponse: t } = e, { t: r } = on(), o = Ce(""), s = De(() => o.value === "" || t.value);
		async function i(a) {
			if (a.preventDefault(), s.value)
				return;
			const l = o.value;
			o.value = "", await e.sendMessage(l);
		}
		async function c(a) {
			a.shiftKey || await i(a);
		}
		return (a, l) => (I(), H("div", j8, [
			rr(J("textarea", {
				"onUpdate:modelValue": l[0] || (l[0] = (u) => o.value = u),
				rows: "1",
				placeholder: V(r)("inputPlaceholder"),
				onKeydown: oo(c, ["enter"])
			}, null, 40, Z8), [
				[so, o.value]
			]),
			J("button", {
				disabled: s.value,
				class: "chat-input-send-button",
				onClick: i
			}, [
				_e(V(G8), {
					height: "32",
					width: "32"
				})
			], 8, W8)
		]));
	}
}), Hr = /* @__PURE__ */ te({
	__name: "Chat",
	setup(n) {
		const { t: e } = on(), t = $n(), { messages: r, currentSessionId: o } = t, { options: s } = Un();
		async function i() {
			t.startNewSession(), Be(() => {
				xe.emit("scrollToBottom");
			});
		}
		async function c() {
			await t.loadPreviousSession(), Be(() => {
				xe.emit("scrollToBottom");
			});
		}
		return Fn(async () => {
			await c(), !s.showWelcomeScreen && !o.value && await i();
		}), (a, l) => (I(), X(_s, { class: "chat-wrapper" }, {
			header: ke(() => [
				J("h1", null, Xe(V(e)("title")), 1),
				J("p", null, Xe(V(e)("subtitle")), 1)
			]),
			footer: ke(() => [
				V(o) ? (I(), X(K8, { key: 0 })) : (I(), X(Ts, { key: 1 }))
			]),
			default: ke(() => [
				!V(o) && V(s).showWelcomeScreen ? (I(), X(ys, {
					key: 0,
					"onClick:button": i
				})) : (I(), X(z8, {
					key: 1,
					messages: V(r)
				}, null, 8, ["messages"]))
			]),
			_: 1
		}));
	}
}), J8 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
}, Y8 = /* @__PURE__ */ J("path", {
	fill: "currentColor",
	d: "M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8"
}, null, -1), X8 = [
	Y8
];
function Q8(n, e) {
	return I(), H("svg", J8, [...X8]);
}
const e5 = { name: "mdi-chat", render: Q8 }, n5 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
}, t5 = /* @__PURE__ */ J("path", {
	fill: "currentColor",
	d: "M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
}, null, -1), r5 = [
	t5
];
function o5(n, e) {
	return I(), H("svg", n5, [...r5]);
}
const s5 = { name: "mdi-chevron-down", render: o5 }, c5 = { class: "chat-window-wrapper" }, i5 = { class: "chat-window" }, a5 = /* @__PURE__ */ te({
	__name: "ChatWindow",
	setup(n) {
		const e = Ce(!1);
		function t() {
			e.value = !e.value, e.value && Be(() => {
				xe.emit("scrollToBottom");
			});
		}
		return (r, o) => (I(), H("div", c5, [
			_e(ct, { name: "chat-window-transition" }, {
				default: ke(() => [
					rr(J("div", i5, [
						_e(Hr)
					], 512), [
						[co, e.value]
					])
				]),
				_: 1
			}),
			J("div", {
				class: "chat-window-toggle",
				onClick: t
			}, [
				_e(ct, {
					name: "chat-window-toggle-transition",
					mode: "out-in"
				}, {
					default: ke(() => [
						e.value ? (I(), X(V(s5), {
							key: 1,
							height: "32",
							width: "32"
						})) : (I(), X(V(e5), {
							key: 0,
							height: "32",
							width: "32"
						}))
					]),
					_: 1
				})
			])
		]));
	}
}), l5 = /* @__PURE__ */ te({
	__name: "App",
	props: {},
	setup(n) {
		const { options: e } = Un(), t = De(() => e.mode === "fullscreen");
		return Fn(() => {
			en.registerLanguage("xml", rs), en.registerLanguage("javascript", as);
		}), (r, o) => t.value ? (I(), X(V(Hr), {
			key: 0,
			class: "n8n-chat"
		})) : (I(), X(V(a5), {
			key: 1,
			class: "n8n-chat"
		}));
	}
});
var Ye, u5 = new Uint8Array(16);
function f5() {
	if (!Ye && (Ye = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto < "u" && typeof msCrypto.getRandomValues == "function" && msCrypto.getRandomValues.bind(msCrypto), !Ye))
		throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
	return Ye(u5);
}
const p5 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function h5(n) {
	return typeof n == "string" && p5.test(n);
}
var Z = [];
for (var Mn = 0; Mn < 256; ++Mn)
	Z.push((Mn + 256).toString(16).substr(1));
function d5(n) {
	var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, t = (Z[n[e + 0]] + Z[n[e + 1]] + Z[n[e + 2]] + Z[n[e + 3]] + "-" + Z[n[e + 4]] + Z[n[e + 5]] + "-" + Z[n[e + 6]] + Z[n[e + 7]] + "-" + Z[n[e + 8]] + Z[n[e + 9]] + "-" + Z[n[e + 10]] + Z[n[e + 11]] + Z[n[e + 12]] + Z[n[e + 13]] + Z[n[e + 14]] + Z[n[e + 15]]).toLowerCase();
	if (!h5(t))
		throw TypeError("Stringified UUID is invalid");
	return t;
}
function Le(n, e, t) {
	n = n || {};
	var r = n.random || (n.rng || f5)();
	if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, e) {
		t = t || 0;
		for (var o = 0; o < 16; ++o)
			e[t + o] = r[o];
		return e;
	}
	return d5(r);
}
async function g5() {
	return "";
}
async function Gr(...n) {
	var r;
	const e = await g5();
	return await (await fetch(n[0], {
		...n[1],
		mode: "cors",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
			...e ? { authorization: `Bearer ${e}` } : {},
			...(r = n[1]) == null ? void 0 : r.headers
		}
	})).json();
}
async function jr(n, e = {}, t = {}) {
	let r = n;
	return Object.keys(e).length > 0 && (r = `${r}?${new URLSearchParams(
		e
	).toString()}`), await Gr(r, { ...t, method: "GET" });
}
async function Zr(n, e = {}, t = {}) {
	return await Gr(n, {
		...t,
		method: "POST",
		body: JSON.stringify(e)
	});
}
async function m5(n, e) {
	var r, o;
	return await (((r = e.webhookConfig) == null ? void 0 : r.method) === "POST" ? Zr : jr)(
		`${e.webhookUrl}`,
		{
			action: "loadPreviousSession",
			[e.chatSessionKey]: n,
			...e.metadata ? { metadata: e.metadata } : {}
		},
		{
			headers: (o = e.webhookConfig) == null ? void 0 : o.headers
		}
	);
}
async function b5(n, e, t) {
	var o, s;
	return await (((o = t.webhookConfig) == null ? void 0 : o.method) === "POST" ? Zr : jr)(
		`${t.webhookUrl}`,
		{
			action: "sendMessage",
			[t.chatSessionKey]: e,
			[t.chatInputKey]: n,
			...t.metadata ? { metadata: t.metadata } : {}
		},
		{
			headers: (s = t.webhookConfig) == null ? void 0 : s.headers
		}
	);
}
const _5 = {
	install(n, e) {
		n.provide(yr, e);
		const t = Ce([]), r = Ce(null), o = Ce(!1), s = De(
			() => (e.initialMessages ?? []).map((u) => ({
				id: Le(),
				text: u,
				sender: "bot",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}))
		);
		async function i(u) {
			const h = {
				id: Le(),
				text: u,
				sender: "user",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			t.value.push(h), o.value = !0, Be(() => {
				xe.emit("scrollToBottom");
			});
			const f = await b5(
				u,
				r.value,
				e
			);
			let p = f.output ?? f.text ?? "";
			if (p === "" && Object.keys(f).length > 0)
				try {
					p = JSON.stringify(f, null, 2);
				} catch {
				}
			const g = {
				id: Le(),
				text: p,
				sender: "bot",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			t.value.push(g), o.value = !1, Be(() => {
				xe.emit("scrollToBottom");
			});
		}
		async function c() {
			if (!e.loadPreviousSession)
				return;
			const u = localStorage.getItem(gt) ?? Le(), h = await m5(u, e), f = (/* @__PURE__ */ new Date()).toISOString();
			return t.value = ((h == null ? void 0 : h.data) || []).map((p, g) => ({
				id: `${g}`,
				text: p.kwargs.content,
				sender: p.id.includes("HumanMessage") ? "user" : "bot",
				createdAt: f
			})), t.value.length && (r.value = u), u;
		}
		async function a() {
			r.value = Le(), localStorage.setItem(gt, r.value);
		}
		const l = {
			initialMessages: s,
			messages: t,
			currentSessionId: r,
			waitingForResponse: o,
			loadPreviousSession: c,
			startNewSession: a,
			sendMessage: i
		};
		n.provide(xr, l), n.config.globalProperties.$chat = l;
	}
};
function v5(n) {
	var o, s;
	const e = {
		...Me,
		...n,
		webhookConfig: {
			...Me.webhookConfig,
			...n == null ? void 0 : n.webhookConfig
		},
		i18n: {
			...Me.i18n,
			...n == null ? void 0 : n.i18n,
			en: {
				...(o = Me.i18n) == null ? void 0 : o.en,
				...(s = n == null ? void 0 : n.i18n) == null ? void 0 : s.en
			}
		},
		theme: {
			...Me.theme,
			...n == null ? void 0 : n.theme
		}
	}, t = e.target ?? ks;
	typeof t == "string" && ds(t);
	const r = io(l5);
	return r.use(_5, e), r.mount(t), r;
}
export {
	v5 as createChat
};
