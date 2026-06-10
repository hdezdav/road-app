(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,784410,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return l},searchParamsToUrlQuery:function(){return a},urlQueryToSearchParams:function(){return i}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});function a(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function s(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function i(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,s(e));else t.set(r,s(n));return t}function l(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},424625,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return w},MiddlewareNotFoundError:function(){return k},MissingStaticPage:function(){return v},NormalizeError:function(){return b},PageNotFoundError:function(){return g},SP:function(){return m},ST:function(){return f},WEB_VITALS:function(){return a},execOnce:function(){return s},getDisplayName:function(){return u},getLocationOrigin:function(){return c},getURL:function(){return p},isAbsoluteUrl:function(){return l},isResSent:function(){return d},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return y},stringifyError:function(){return x}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=["CLS","FCP","FID","INP","LCP","TTFB"];function s(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let i=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>i.test(e);function c(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function p(){let{href:e}=window.location,t=c();return e.substring(t.length)}function u(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function d(e){return e.finished||e.headersSent}function y(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&d(r))return n;if(!n)throw Object.defineProperty(Error(`"${u(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let m="u">typeof performance,f=m&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class w extends Error{}class b extends Error{}class g extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class v extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class k extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function x(e){return JSON.stringify({message:e.message,stack:e.stack})}},775625,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},612864,e=>{"use strict";let t=(0,e.i(143403).default)("trophy",[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]]);e.s(["Trophy",0,t],612864)},908660,e=>{"use strict";var t=e.i(647426);function r(e,n={}){let o=function(e,t={}){try{return e.getClient(t)}catch{return}}(e,n);return o?.extend(t.publicActions)}var n=e.i(600791),o=e.i(528010);e.s(["usePublicClient",0,function(e={}){let t=(0,o.useConfig)(e);return(0,n.useSyncExternalStoreWithSelector)(e=>(function(e,t){let{onChange:n}=t;return e.subscribe(()=>r(e),n,{equalityFn:(e,t)=>e?.uid===t?.uid})})(t,{onChange:e}),()=>r(t,e),()=>r(t,e),e=>e,(e,t)=>e?.uid===t?.uid)}],908660)},71807,e=>{"use strict";var t=e.i(838026);class r extends t.BaseError{constructor(){super("Chain not configured."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ChainNotConfiguredError"})}}class n extends t.BaseError{constructor(){super("Connector already connected."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ConnectorAlreadyConnectedError"})}}class o extends t.BaseError{constructor(){super("Connector not connected."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ConnectorNotConnectedError"})}}t.BaseError;class a extends t.BaseError{constructor({address:e,connector:t}){super(`Account "${e}" not found for connector "${t.name}".`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ConnectorAccountNotFoundError"})}}class s extends t.BaseError{constructor({connectionChainId:e,connectorChainId:t}){super(`The current chain of the connector (id: ${t}) does not match the connection's chain (id: ${e}).`,{metaMessages:[`Current Chain ID:  ${t}`,`Expected Chain ID: ${e}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ConnectorChainMismatchError"})}}class i extends t.BaseError{constructor({connector:e}){super(`Connector "${e.name}" unavailable while reconnecting.`,{details:"During the reconnection step, the only connector methods guaranteed to be available are: `id`, `name`, `type`, `uid`. All other methods are not guaranteed to be available until reconnection completes and connectors are fully restored. This error commonly occurs for connectors that asynchronously inject after reconnection has already started."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ConnectorUnavailableReconnectingError"})}}e.s(["ChainNotConfiguredError",0,r,"ConnectorAccountNotFoundError",0,a,"ConnectorAlreadyConnectedError",0,n,"ConnectorChainMismatchError",0,s,"ConnectorNotConnectedError",0,o,"ConnectorUnavailableReconnectingError",0,i])},374362,e=>{"use strict";var t=e.i(994229);e.s(["custom",0,function(e,r={}){let{key:n="custom",methods:o,name:a="Custom Provider",retryDelay:s}=r;return({retryCount:i})=>(0,t.createTransport)({key:n,methods:o,name:a,request:e.request.bind(e),retryCount:r.retryCount??i,retryDelay:s,type:"custom"})}])},534528,e=>{"use strict";var t=e.i(528200),r=e.i(374362),n=e.i(111063),o=e.i(697907),a=e.i(71807);async function s(e,i={}){let l,{assertChainId:c=!0}=i;if(i.connector){let{connector:t}=i;if("reconnecting"===e.state.status&&!t.getAccounts&&!t.getChainId)throw new a.ConnectorUnavailableReconnectingError({connector:t});let[r,n]=await Promise.all([t.getAccounts().catch(e=>{if(null===i.account)return[];throw e}),t.getChainId()]);l={accounts:r,chainId:n,connector:t}}else l=e.state.connections.get(e.state.current);if(!l)throw new a.ConnectorNotConnectedError;let p=i.chainId??l.chainId,u=await l.connector.getChainId();if(c&&u!==p)throw new a.ConnectorChainMismatchError({connectionChainId:p,connectorChainId:u});let d=l.connector;if(d.getClient)return d.getClient({chainId:p});let y=(0,o.parseAccount)(i.account??l.accounts[0]);if(y&&(y.address=(0,n.getAddress)(y.address)),i.account&&!l.accounts.some(e=>e.toLowerCase()===y.address.toLowerCase()))throw new a.ConnectorAccountNotFoundError({address:y.address,connector:d});let h=e.chains.find(e=>e.id===p),m=await l.connector.getProvider({chainId:p});return(0,t.createClient)({account:y,chain:h,name:"Connector Client",transport:e=>(0,r.custom)(m)({...e,retryCount:0})})}e.s(["getConnectorClient",0,s])},442673,(e,t,r)=>{t.exports=e.r(656844)},858674,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return i},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=e.r(744066)._(e.r(784410)),s=/https?|ftp|gopher|file/;function i(e){let{auth:t,hostname:r}=e,n=e.protocol||"",o=e.pathname||"",i=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(a.urlQueryToSearchParams(l)));let p=e.search||l&&`?${l}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||s.test(n))&&!1!==c?(c="//"+(c||""),o&&"/"!==o[0]&&(o="/"+o)):c||(c=""),i&&"#"!==i[0]&&(i="#"+i),p&&"?"!==p[0]&&(p="?"+p),o=o.replace(/[?#]/g,encodeURIComponent),p=p.replace("#","%23"),`${n}${c}${o}${p}${i}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return i(e)}},44142,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return o}});let n=e.r(835180);function o(e,t){let r=(0,n.useRef)(null),o=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=o.current;t&&(o.current=null,t())}else e&&(r.current=a(e,n)),t&&(o.current=a(t,n))},[e,t])}function a(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},170352,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return a}});let n=e.r(424625),o=e.r(720421);function a(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,o.hasBasePath)(r.pathname)}catch(e){return!1}}},203384,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},370992,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return w},useLinkStatus:function(){return g}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=e.r(744066),s=e.r(576659),i=a._(e.r(835180)),l=e.r(858674),c=e.r(797878),p=e.r(44142),u=e.r(424625),d=e.r(111031);e.r(775625);let y=e.r(955915),h=e.r(214716),m=e.r(170352),f=e.r(149038);function w(t){var r,n;let o,a,w,[g,v]=(0,i.useOptimistic)(h.IDLE_LINK_STATUS),k=(0,i.useRef)(null),{href:x,as:C,children:T,prefetch:I=null,passHref:W,replace:P,shallow:_,scroll:A,onClick:O,onMouseEnter:E,onTouchStart:R,legacyBehavior:j=!1,onNavigate:S,transitionTypes:q,ref:B,unstable_dynamicOnHover:M,...N}=t;o=T,j&&("string"==typeof o||"number"==typeof o)&&(o=(0,s.jsx)("a",{children:o}));let L=i.default.useContext(c.AppRouterContext),F=!1!==I,z=!1!==I?null===(n=I)||"auto"===n?f.FetchStrategy.PPR:f.FetchStrategy.Full:f.FetchStrategy.PPR,H="string"==typeof(r=C||x)?r:(0,l.formatUrl)(r);if(j){if(o?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});a=i.default.Children.only(o)}let U=j?a&&"object"==typeof a&&a.ref:B,D=i.default.useCallback(e=>(null!==L&&(k.current=(0,h.mountLinkInstance)(e,H,L,z,F,v)),()=>{k.current&&((0,h.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,h.unmountPrefetchableInstance)(e)}),[F,H,L,z,v]),G={ref:(0,p.useMergedRef)(D,U),onClick(t){j||"function"!=typeof O||O(t),j&&a.props&&"function"==typeof a.props.onClick&&a.props.onClick(t),!L||t.defaultPrevented||function(t,r,n,o,a,s,l){if("u">typeof window){let c,{nodeName:p}=t.currentTarget;if("A"===p.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){o&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(332423);i.default.startTransition(()=>{u(r,o?"replace":"push",!1===a?y.ScrollBehavior.NoScroll:y.ScrollBehavior.Default,n.current,l)})}}(t,H,k,P,A,S,q)},onMouseEnter(e){j||"function"!=typeof E||E(e),j&&a.props&&"function"==typeof a.props.onMouseEnter&&a.props.onMouseEnter(e),L&&F&&(0,h.onNavigationIntent)(e.currentTarget,!0===M)},onTouchStart:function(e){j||"function"!=typeof R||R(e),j&&a.props&&"function"==typeof a.props.onTouchStart&&a.props.onTouchStart(e),L&&F&&(0,h.onNavigationIntent)(e.currentTarget,!0===M)}};return(0,u.isAbsoluteUrl)(H)?G.href=H:j&&!W&&("a"!==a.type||"href"in a.props)||(G.href=(0,d.addBasePath)(H)),w=j?i.default.cloneElement(a,G):(0,s.jsx)("a",{...N,...G,children:o}),(0,s.jsx)(b.Provider,{value:g,children:w})}e.r(203384);let b=(0,i.createContext)(h.IDLE_LINK_STATUS),g=()=>(0,i.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},538749,e=>{"use strict";var t=e.i(918871),r=e.i(123647),n=e.i(54084),o=e.i(814149),a=e.i(528010);e.s(["useReadContract",0,function(e={}){let{abi:s,address:i,functionName:l,query:c={}}=e,p=e.code,u=(0,a.useConfig)(e),d=(0,o.useChainId)({config:u}),y=function(e,n={}){return{async queryFn({queryKey:r}){let o=n.abi;if(!o)throw Error("abi is required");let{functionName:a,scopeKey:s,...i}=r[1],l=(()=>{let e=r[1];if(e.address)return{address:e.address};if(e.code)return{code:e.code};throw Error("address or code is required")})();if(!a)throw Error("functionName is required");return(0,t.readContract)(e,{abi:o,functionName:a,args:i.args,...l,...i})},queryKey:function(e={}){let{abi:t,...n}=e;return["readContract",(0,r.filterQueryOptions)(n)]}(n)}}(u,{...e,chainId:e.chainId??d}),h=!!((i||p)&&s&&l&&(c.enabled??!0));return(0,n.useQuery)({...c,...y,enabled:h,structuralSharing:c.structuralSharing??r.structuralSharing})}],538749)},262504,(e,t,r)=>{t.exports={abi:[{inputs:[{internalType:"string",name:"_baseMetadataURI",type:"string"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"owner",type:"address"}],name:"ERC721IncorrectOwner",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721InsufficientApproval",type:"error"},{inputs:[{internalType:"address",name:"approver",type:"address"}],name:"ERC721InvalidApprover",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"}],name:"ERC721InvalidOperator",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"ERC721InvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"receiver",type:"address"}],name:"ERC721InvalidReceiver",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"}],name:"ERC721InvalidSender",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721NonexistentToken",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"approved",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"operator",type:"address"},{indexed:!1,internalType:"bool",name:"approved",type:"bool"}],name:"ApprovalForAll",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"string",name:"newBaseURI",type:"string"}],name:"BaseURIChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"_fromTokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"_toTokenId",type:"uint256"}],name:"BatchMetadataUpdate",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"cardCatalogId",type:"uint256"}],name:"CardMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"MetadataUpdate",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"minter",type:"address"},{indexed:!1,internalType:"bool",name:"status",type:"bool"}],name:"MinterStatusChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"player",type:"address"}],name:"StarterClaimed",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Transfer",type:"event"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approve",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"authorizedMinters",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"baseMetadataURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"cards",outputs:[{internalType:"uint256",name:"cardCatalogId",type:"uint256"},{internalType:"uint256",name:"attack",type:"uint256"},{internalType:"uint256",name:"defense",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getApproved",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"player",type:"address"}],name:"getOwnedCards",outputs:[{components:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"cardCatalogId",type:"uint256"},{internalType:"uint256",name:"attack",type:"uint256"},{internalType:"uint256",name:"defense",type:"uint256"}],internalType:"struct RoadAppNFTCards.OwnedCardInfo[]",name:"",type:"tuple[]"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"hasClaimedStarter",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"operator",type:"address"}],name:"isApprovedForAll",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"bossId",type:"uint256"}],name:"mintBossCard",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"cardCatalogId",type:"uint256"},{internalType:"uint256",name:"attack",type:"uint256"},{internalType:"uint256",name:"defense",type:"uint256"}],name:"mintCard",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"phase",type:"uint256"}],name:"mintRewardPack",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"mintStarterPack",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ownerOf",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"bool",name:"approved",type:"bool"}],name:"setApprovalForAll",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"string",name:"_newBaseURI",type:"string"}],name:"setBaseMetadataURI",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"minter",type:"address"},{internalType:"bool",name:"status",type:"bool"}],name:"setMinter",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"transferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"}]}},19008,(e,t,r)=>{t.exports={abi:[{inputs:[],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"ECDSAInvalidSignature",type:"error"},{inputs:[{internalType:"uint256",name:"length",type:"uint256"}],name:"ECDSAInvalidSignatureLength",type:"error"},{inputs:[{internalType:"bytes32",name:"s",type:"bytes32"}],name:"ECDSAInvalidSignatureS",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"player",type:"address"},{indexed:!1,internalType:"uint256",name:"phase",type:"uint256"}],name:"BossDefeated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"player",type:"address"},{indexed:!1,internalType:"uint256",name:"newPhase",type:"uint256"}],name:"PhaseAdvanced",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"player",type:"address"}],name:"SeedPhraseBackedUp",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"newSigner",type:"address"}],name:"SignerUpdated",type:"event"},{inputs:[{internalType:"address",name:"player",type:"address"}],name:"getPlayerState",outputs:[{components:[{internalType:"uint256",name:"currentPhase",type:"uint256"},{internalType:"bool",name:"hasSeedPhraseBackedUp",type:"bool"},{internalType:"bool",name:"hasDefeatedPhase1",type:"bool"},{internalType:"bool",name:"hasDefeatedPhase2",type:"bool"},{internalType:"bool",name:"hasDefeatedPhase3",type:"bool"}],internalType:"struct RoadAppGameState.PlayerState",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[],name:"nftContract",outputs:[{internalType:"contract IRoadAppNFTCards",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"players",outputs:[{internalType:"uint256",name:"currentPhase",type:"uint256"},{internalType:"bool",name:"hasSeedPhraseBackedUp",type:"bool"},{internalType:"bool",name:"hasDefeatedPhase1",type:"bool"},{internalType:"bool",name:"hasDefeatedPhase2",type:"bool"},{internalType:"bool",name:"hasDefeatedPhase3",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"phase",type:"uint256"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"recordBossDefeat",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"registerPlayer",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_nftContract",type:"address"}],name:"setNFTContract",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_signer",type:"address"}],name:"setTrustedSigner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"trustedSigner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"verifySeedPhraseBackup",outputs:[],stateMutability:"nonpayable",type:"function"}]}},23348,(e,t,r)=>{t.exports={abi:[{inputs:[{internalType:"address",name:"_nftCardsAddress",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"player",type:"address"},{indexed:!1,internalType:"uint256[]",name:"deckIds",type:"uint256[]"}],name:"DeckSaved",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{inputs:[{internalType:"address",name:"player",type:"address"}],name:"getActiveDeck",outputs:[{internalType:"uint256[]",name:"",type:"uint256[]"}],stateMutability:"view",type:"function"},{inputs:[],name:"nftCardsContract",outputs:[{internalType:"contract IRoadAppNFTCards",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256[]",name:"deckIds",type:"uint256[]"}],name:"saveDeck",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_nftCardsAddress",type:"address"}],name:"setNFTCardsContract",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"player",type:"address"}],name:"validateDeck",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"}]}},360786,e=>{"use strict";var t=e.i(77758),r=e.i(262504),n=e.i(19008),o=e.i(23348);let a={NFT_CARDS:t.default.env.NEXT_PUBLIC_NFT_CARDS_ADDRESS||"0x8337B68cB0b30E88A9F7CbD81a6A7c91abe52688",GAME_STATE:t.default.env.NEXT_PUBLIC_GAME_STATE_ADDRESS||"0xd5145eAEc7510DFa6cD590e6Ca3e6954e3b3c843",DECK_MANAGER:t.default.env.NEXT_PUBLIC_DECK_MANAGER_ADDRESS||"0x9d9718E794ec0EA3ac726acbC05920A05f532dFF"},s=r.default.abi,i=n.default.abi,l=o.default.abi;e.s(["CONTRACT_ADDRESSES",0,a,"DECK_MANAGER_ABI",0,l,"GAME_STATE_ABI",0,i,"NFT_CARDS_ABI",0,s])},109862,e=>{"use strict";var t=e.i(576659),r=e.i(835180),n=e.i(909537),o=e.i(538749),a=e.i(274554),s=e.i(360786);let i=(0,r.createContext)(null);e.s(["InventoryProvider",0,function({children:e}){let{address:l}=(0,n.useAccount)(),{data:c,refetch:p,isLoading:u}=(0,o.useReadContract)({address:s.CONTRACT_ADDRESSES.NFT_CARDS,abi:s.NFT_CARDS_ABI,functionName:"getOwnedCards",args:l?[l]:void 0,query:{enabled:!!l}}),{data:d,refetch:y,isLoading:h}=(0,o.useReadContract)({address:s.CONTRACT_ADDRESSES.GAME_STATE,abi:s.GAME_STATE_ABI,functionName:"getPlayerState",args:l?[l]:void 0,query:{enabled:!!l}}),m=(0,r.useMemo)(()=>(console.log("DEBUG: ownedCardsData from Celo:",c),c)?c.map((e,t)=>{console.log(`DEBUG: Raw item [${t}] from getOwnedCards:`,e);let r=Number(Array.isArray(e)?e[0]:e.tokenId??e.token_id??e[0]??0),n=Number(Array.isArray(e)?e[1]:e.cardCatalogId??e.card_catalog_id??e[1]??0);console.log(`DEBUG: Parsed item [${t}] -> tokenId:`,r,"cardCatalogId:",n);let o=a.heroCards.find(e=>e.tokenId===n);return o?{...o,id:`${o.id}-${r}`,nftTokenId:r,tokenId:n}:(console.log(`DEBUG: No baseCard found in heroCards for cardCatalogId: ${n}`),null)}).filter(Boolean):[],[c]),f=(0,r.useMemo)(()=>m.map(e=>e.id),[m]),w=(0,r.useMemo)(()=>!!d&&(Array.isArray(d)?Number(d[0]||0)>0:Number(d.currentPhase||0)>0),[d]),b=(0,r.useMemo)(()=>d?Array.isArray(d)?Number(d[0]||0):Number(d.currentPhase||0):0,[d]),g=(0,r.useMemo)(()=>!!d&&(Array.isArray(d)?!!d[1]:!!d.hasSeedPhraseBackedUp),[d]),v=(0,r.useMemo)(()=>!!d&&(Array.isArray(d)?!!d[2]:!!d.hasDefeatedPhase1),[d]),k=(0,r.useMemo)(()=>!!d&&(Array.isArray(d)?!!d[3]:!!d.hasDefeatedPhase2),[d]),x=(0,r.useMemo)(()=>!!d&&(Array.isArray(d)?!!d[4]:!!d.hasDefeatedPhase3),[d]),C=(0,r.useCallback)(async()=>{await Promise.all([p(),y()])},[p,y]);(0,r.useEffect)(()=>{l&&C()},[l,C]);let T=(0,r.useCallback)(e=>m.some(t=>t.id===e||t.id.split("-")[0]===String(e)||t.tokenId===Number(e)),[m]),I=(0,r.useMemo)(()=>({address:l,ownedCardIds:f,ownedCards:m,hasOpenedPack:w,currentPhase:b,hasSeedPhraseBackedUp:g,hasDefeatedPhase1:v,hasDefeatedPhase2:k,hasDefeatedPhase3:x,isLoading:u||h,ownsCard:T,refetch:C}),[l,f,m,w,b,g,v,k,x,u,h,T,C]);return(0,t.jsx)(i.Provider,{value:I,children:e})},"useInventory",0,function(){let e=(0,r.useContext)(i);if(!e)throw Error("useInventory must be used within <InventoryProvider>");return e}])},274781,e=>{"use strict";let t=(0,e.i(143403).default)("gift",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"1sqzm4"}],["path",{d:"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5",key:"kc0143"}],["rect",{x:"3",y:"7",width:"18",height:"4",rx:"1",key:"1hberx"}]]);e.s(["Gift",0,t],274781)},169332,e=>{"use strict";var t=`{
  "connect_wallet": {
    "label": "Connect Wallet",
    "wrong_network": {
      "label": "Wrong network"
    }
  },

  "intro": {
    "title": "What is a Wallet?",
    "description": "A wallet is used to send, receive, store, and display digital assets. It's also a new way to log in, without needing to create new accounts and passwords on every website.",
    "digital_asset": {
      "title": "A Home for your Digital Assets",
      "description": "Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs."
    },
    "login": {
      "title": "A New Way to Log In",
      "description": "Instead of creating new accounts and passwords on every website, just connect your wallet."
    },
    "get": {
      "label": "Get a Wallet"
    },
    "learn_more": {
      "label": "Learn More"
    }
  },

  "sign_in": {
    "label": "Verify your account",
    "description": "To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.",
    "message": {
      "send": "Sign message",
      "preparing": "Preparing message...",
      "cancel": "Cancel",
      "preparing_error": "Error preparing message, please retry!"
    },
    "signature": {
      "waiting": "Waiting for signature...",
      "verifying": "Verifying signature...",
      "signing_error": "Error signing message, please retry!",
      "verifying_error": "Error verifying signature, please retry!",
      "oops_error": "Oops, something went wrong!"
    }
  },

  "connect": {
    "label": "Connect",
    "title": "Connect a Wallet",
    "new_to_ethereum": {
      "description": "New to Ethereum wallets?",
      "learn_more": {
        "label": "Learn More"
      }
    },
    "learn_more": {
      "label": "Learn more"
    },
    "recent": "Recent",
    "status": {
      "opening": "Opening %{wallet}...",
      "connecting": "Connecting",
      "connect_mobile": "Continue in %{wallet}",
      "not_installed": "%{wallet} is not installed",
      "not_available": "%{wallet} is not available",
      "confirm": "Confirm connection in the extension",
      "confirm_mobile": "Accept connection request in the wallet"
    },
    "secondary_action": {
      "get": {
        "description": "Don't have %{wallet}?",
        "label": "GET"
      },
      "install": {
        "label": "INSTALL"
      },
      "retry": {
        "label": "RETRY"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Need the official WalletConnect modal?",
        "compact": "Need the WalletConnect modal?"
      },
      "open": {
        "label": "OPEN"
      }
    }
  },

  "connect_scan": {
    "title": "Scan with %{wallet}",
    "fallback_title": "Scan with your phone"
  },

  "connector_group": {
    "installed": "Installed",
    "recommended": "Recommended",
    "other": "Other",
    "popular": "Popular",
    "more": "More",
    "others": "Others"
  },

  "get": {
    "title": "Get a Wallet",
    "action": {
      "label": "GET"
    },
    "mobile": {
      "description": "Mobile Wallet"
    },
    "extension": {
      "description": "Browser Extension"
    },
    "mobile_and_extension": {
      "description": "Mobile Wallet and Extension"
    },
    "mobile_and_desktop": {
      "description": "Mobile and Desktop Wallet"
    },
    "looking_for": {
      "title": "Not what you're looking for?",
      "mobile": {
        "description": "Select a wallet on the main screen to get started with a different wallet provider."
      },
      "desktop": {
        "compact_description": "Select a wallet on the main screen to get started with a different wallet provider.",
        "wide_description": "Select a wallet on the left to get started with a different wallet provider."
      }
    }
  },

  "get_options": {
    "title": "Get started with %{wallet}",
    "short_title": "Get %{wallet}",
    "mobile": {
      "title": "%{wallet} for Mobile",
      "description": "Use the mobile wallet to explore the world of Ethereum.",
      "download": {
        "label": "Get the app"
      }
    },
    "extension": {
      "title": "%{wallet} for %{browser}",
      "description": "Access your wallet right from your favorite web browser.",
      "download": {
        "label": "Add to %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} for %{platform}",
      "description": "Access your wallet natively from your powerful desktop.",
      "download": {
        "label": "Add to %{platform}"
      }
    }
  },

  "get_mobile": {
    "title": "Install %{wallet}",
    "description": "Scan with your phone to download on iOS or Android",
    "continue": {
      "label": "Continue"
    }
  },

  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "extension": {
      "refresh": {
        "label": "Refresh"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "desktop": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    }
  },

  "chains": {
    "title": "Switch Networks",
    "wrong_network": "Wrong network detected, switch or disconnect to continue.",
    "confirm": "Confirm in Wallet",
    "switching_not_supported": "Your wallet does not support switching networks from %{appName}. Try switching networks from within your wallet instead.",
    "switching_not_supported_fallback": "Your wallet does not support switching networks from this app. Try switching networks from within your wallet instead.",
    "disconnect": "Disconnect",
    "connected": "Connected"
  },

  "profile": {
    "disconnect": {
      "label": "Disconnect"
    },
    "copy_address": {
      "label": "Copy Address",
      "copied": "Copied!"
    },
    "explorer": {
      "label": "View more on explorer"
    },
    "transactions": {
      "description": "%{appName} transactions will appear here...",
      "description_fallback": "Your transactions will appear here...",
      "recent": {
        "title": "Recent Transactions"
      },
      "clear": {
        "label": "Clear All"
      }
    }
  },

  "wallet_connectors": {
    "ready": {
      "qr_code": {
        "step1": {
          "description": "Add Ready to your home screen for faster access to your wallet.",
          "title": "Open the Ready app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "berasig": {
      "extension": {
        "step1": {
          "title": "Install the BeraSig extension",
          "description": "We recommend pinning BeraSig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "best": {
      "qr_code": {
        "step1": {
          "title": "Open the Best Wallet app",
          "description": "Add Best Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bifrost Wallet on your home screen for quicker access.",
          "title": "Open the Bifrost Wallet app"
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "bitget": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bitget Wallet on your home screen for quicker access.",
          "title": "Open the Bitget Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Bitget Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitget Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitski": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Bitski to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitski extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitverse": {
      "qr_code": {
        "step1": {
          "title": "Open the Bitverse Wallet app",
          "description": "Add Bitverse Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bloom": {
      "desktop": {
        "step1": {
          "title": "Open the Bloom Wallet app",
          "description": "We recommend putting Bloom Wallet on your home screen for quicker access."
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you have a wallet, click on Connect to connect via Bloom. A connection prompt in the app will appear for you to confirm the connection.",
          "title": "Click on Connect"
        }
      }
    },

    "bybit": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bybit on your home screen for faster access to your wallet.",
          "title": "Open the Bybit app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Bybit Wallet for easy access.",
          "title": "Install the Bybit Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Bybit Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "binance": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Binance on your home screen for faster access to your wallet.",
          "title": "Open the Binance app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Binance Wallet extension",
          "description": "We recommend pinning Binance Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "coin98": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coin98 Wallet on your home screen for faster access to your wallet.",
          "title": "Open the Coin98 Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Coin98 Wallet for easy access.",
          "title": "Install the Coin98 Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Coin98 Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coinbase Wallet on your home screen for quicker access.",
          "title": "Open the Coinbase Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Coinbase Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Coinbase Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "compass": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Compass Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Compass Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "core": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Core on your home screen for faster access to your wallet.",
          "title": "Open the Core app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Core to your taskbar for quicker access to your wallet.",
          "title": "Install the Core extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "fox": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting FoxWallet on your home screen for quicker access.",
          "title": "Open the FoxWallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "frontier": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Frontier Wallet on your home screen for quicker access.",
          "title": "Open the Frontier Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Frontier Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Frontier Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Open the imToken app",
          "description": "Put imToken app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "iopay": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting ioPay on your home screen for faster access to your wallet.",
          "title": "Open the ioPay app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      }
    },

    "kaikas": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaikas to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaikas extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaikas app",
          "description": "Put Kaikas app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kaia": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaia to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaia extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaia app",
          "description": "Put Kaia app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kraken": {
      "qr_code": {
        "step1": {
          "title": "Open the Kraken Wallet app",
          "description": "Add Kraken Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "kresus": {
      "qr_code": {
        "step1": {
          "title": "Open the Kresus Wallet app",
          "description": "Add Kresus Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "magicEden": {
      "extension": {
        "step1": {
          "title": "Install the Magic Eden extension",
          "description": "We recommend pinning Magic Eden to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Open the MetaMask app",
          "description": "We recommend putting MetaMask on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the MetaMask extension",
          "description": "We recommend pinning MetaMask to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "nestwallet": {
      "extension": {
        "step1": {
          "title": "Install the NestWallet extension",
          "description": "We recommend pinning NestWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "okx": {
      "qr_code": {
        "step1": {
          "title": "Open the OKX Wallet app",
          "description": "We recommend putting OKX Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the OKX Wallet extension",
          "description": "We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "omni": {
      "qr_code": {
        "step1": {
          "title": "Open the Omni app",
          "description": "Add Omni to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your home screen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "1inch": {
      "qr_code": {
        "step1": {
          "description": "Put 1inch Wallet on your home screen for faster access to your wallet.",
          "title": "Open the 1inch Wallet app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Open the TokenPocket app",
          "description": "We recommend putting TokenPocket on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the TokenPocket extension",
          "description": "We recommend pinning TokenPocket to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "trust": {
      "qr_code": {
        "step1": {
          "title": "Open the Trust Wallet app",
          "description": "Put Trust Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Trust Wallet extension",
          "description": "Click at the top right of your browser and pin Trust Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up Trust Wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Open the Uniswap app",
          "description": "Add Uniswap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Open the Zerion app",
          "description": "We recommend putting Zerion on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Zerion extension",
          "description": "We recommend pinning Zerion to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Open the Rainbow app",
          "description": "We recommend putting Rainbow on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "You can easily backup your wallet using our backup feature on your phone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "enkrypt": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Enkrypt Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Enkrypt Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "frame": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Frame to your taskbar for quicker access to your wallet.",
          "title": "Install Frame & the companion extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "one_key": {
      "extension": {
        "step1": {
          "title": "Install the OneKey Wallet extension",
          "description": "We recommend pinning OneKey Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "paraswap": {
      "qr_code": {
        "step1": {
          "title": "Open the ParaSwap app",
          "description": "Add ParaSwap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "phantom": {
      "extension": {
        "step1": {
          "title": "Install the Phantom extension",
          "description": "We recommend pinning Phantom to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rabby": {
      "extension": {
        "step1": {
          "title": "Install the Rabby extension",
          "description": "We recommend pinning Rabby to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ronin": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Ronin Wallet on your home screen for quicker access.",
          "title": "Open the Ronin Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Ronin Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Ronin Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "ramper": {
      "extension": {
        "step1": {
          "title": "Install the Ramper extension",
          "description": "We recommend pinning Ramper to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safeheron": {
      "extension": {
        "step1": {
          "title": "Install the Core extension",
          "description": "We recommend pinning Safeheron to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "taho": {
      "extension": {
        "step1": {
          "title": "Install the Taho extension",
          "description": "We recommend pinning Taho to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "wigwam": {
      "extension": {
        "step1": {
          "title": "Install the Wigwam extension",
          "description": "We recommend pinning Wigwam to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "talisman": {
      "extension": {
        "step1": {
          "title": "Install the Talisman extension",
          "description": "We recommend pinning Talisman to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import an Ethereum Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ctrl": {
      "extension": {
        "step1": {
          "title": "Install the CTRL Wallet extension",
          "description": "We recommend pinning CTRL Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "zeal": {
      "qr_code": {
        "step1": {
          "title": "Open the Zeal app",
          "description": "Add Zeal Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Zeal extension",
          "description": "We recommend pinning Zeal to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safepal": {
      "extension": {
        "step1": {
          "title": "Install the SafePal Wallet extension",
          "description": "Click at the top right of your browser and pin SafePal Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up SafePal Wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SafePal Wallet app",
          "description": "Put SafePal Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "desig": {
      "extension": {
        "step1": {
          "title": "Install the Desig extension",
          "description": "We recommend pinning Desig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "subwallet": {
      "extension": {
        "step1": {
          "title": "Install the SubWallet extension",
          "description": "We recommend pinning SubWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SubWallet app",
          "description": "We recommend putting SubWallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "clv": {
      "extension": {
        "step1": {
          "title": "Install the CLV Wallet extension",
          "description": "We recommend pinning CLV Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the CLV Wallet app",
          "description": "We recommend putting CLV Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "okto": {
      "qr_code": {
        "step1": {
          "title": "Open the Okto app",
          "description": "Add Okto to your home screen for quick access"
        },
        "step2": {
          "title": "Create an MPC Wallet",
          "description": "Create an account and generate a wallet"
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Tap the Scan QR icon at the top right and confirm the prompt to connect."
        }
      }
    },

    "ledger": {
      "desktop": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "Set up a new Ledger or connect to an existing one."
        },
        "step3": {
          "title": "Connect",
          "description": "A connection prompt will appear for you to connect your wallet."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "You can either sync with the desktop app or connect your Ledger."
        },
        "step3": {
          "title": "Scan the code",
          "description": "Tap WalletConnect then Switch to Scanner. After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "valora": {
      "qr_code": {
        "step1": {
          "title": "Open the Valora app",
          "description": "We recommend putting Valora on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "gate": {
      "qr_code": {
        "step1": {
          "title": "Open the Gate app",
          "description": "We recommend putting Gate on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Gate extension",
          "description": "We recommend pinning Gate to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "gemini": {
      "qr_code": {
        "step1": {
          "title": "Open keys.gemini.com",
          "description": "Visit keys.gemini.com on your mobile browser - no app download required."
        },
        "step2": {
          "title": "Create Your Wallet Instantly",
          "description": "Set up your smart wallet in seconds using your device's built-in authentication."
        },
        "step3": {
          "title": "Scan to Connect",
          "description": "Scan the QR code to instantly connect your wallet - it just works."
        }
      },
      "extension": {
        "step1": {
          "title": "Go to keys.gemini.com",
          "description": "No extensions or downloads needed - your wallet lives securely in the browser."
        },
        "step2": {
          "title": "One-Click Setup",
          "description": "Create your smart wallet instantly with passkey authentication - easier than any wallet out there."
        },
        "step3": {
          "title": "Connect and Go",
          "description": "Approve the connection and you're ready - the unopinionated wallet that just works."
        }
      }
    },

    "xportal": {
      "qr_code": {
        "step1": {
          "description": "Put xPortal on your home screen for faster access to your wallet.",
          "title": "Open the xPortal app"
        },
        "step2": {
          "description": "Create a wallet or import an existing one.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "mew": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting MEW Wallet on your home screen for quicker access.",
          "title": "Open the MEW Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "zilpay": {
      "qr_code": {
        "step1": {
          "title": "Open the ZilPay app",
          "description": "Add ZilPay to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "nova": {
      "qr_code": {
        "step1": {
          "title": "Open the Nova Wallet app",
          "description": "Add Nova Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "meco": {
      "qr_code": {
        "step1": {
          "title": "Open the MeCo Wallet app",
          "description": "Put MeCo Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "anchorage_digital": {
      "extension": {
        "step1": {
          "title": "Install the Anchorage Digital extension",
          "description": "We recommend pinning Anchorage Digital to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Scan the QR code to login",
          "description": "Securely connect your organization's wallets to dApps with institutional-grade security."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you log in, click below to refresh the browser and load up the extension."
        }
      }
    }
  }
}
`;e.s(["en_US_default",0,t])},956264,e=>{"use strict";var t=e.i(22244);e.s(["withTimeout",0,function(e,{errorInstance:r=Error("timed out"),timeout:n,signal:o}){return new Promise((a,s)=>{(async()=>{let i,l=new AbortController;try{n>0&&(i=setTimeout(()=>{o?l.abort():s(r)},n)),a(await e({signal:l?.signal||null}))}catch(e){if(l?.signal.aborted&&(0,t.isAbortError)(e))return void s(r);s(e)}finally{clearTimeout(i)}})()})}])},686241,e=>{"use strict";var t=e.i(857874);class r extends t.BaseError{constructor(){super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.",{docsPath:"/docs/clients/intro",name:"UrlRequiredError"})}}e.s(["UrlRequiredError",0,r])},634480,915523,e=>{"use strict";var t=e.i(767081),r=e.i(686241),n=e.i(945678),o=e.i(22244),a=e.i(956264),s=e.i(669149);let i={current:0,take(){return this.current++},reset(){this.current=0}};function l(e,r={}){let{url:n,headers:c}=function(e){try{let t=new URL(e),r=(()=>{if(t.username){let e=`${decodeURIComponent(t.username)}:${decodeURIComponent(t.password)}`;return t.username="",t.password="",{url:t.toString(),headers:{Authorization:`Basic ${btoa(e)}`}}}})();return{url:t.toString(),...r}}catch{return{url:e}}}(e);return{async request(e){let{body:l,fetchFn:p=r.fetchFn??fetch,onRequest:u=r.onRequest,onResponse:d=r.onResponse,timeout:y=r.timeout??1e4}=e,h={...r.fetchOptions??{},...e.fetchOptions??{}},{headers:m,method:f,signal:w}=h;try{let e,r=await (0,a.withTimeout)(async({signal:e})=>{let t={...h,body:Array.isArray(l)?(0,s.stringify)(l.map(e=>({jsonrpc:"2.0",id:e.id??i.take(),...e}))):(0,s.stringify)({jsonrpc:"2.0",id:l.id??i.take(),...l}),headers:{...c,"Content-Type":"application/json",...m},method:f||"POST",signal:w||(y>0?e:null)},r=new Request(n,t),o=await u?.(r,t)??{...t,url:n};return await p(o.url??n,o)},{errorInstance:new t.TimeoutError({body:l,url:n}),timeout:y,signal:!0});if(d&&await d(r),r.headers.get("Content-Type")?.startsWith("application/json"))e=await r.json();else{e=await r.text();try{e=JSON.parse(e||"{}")}catch(t){if(r.ok)throw t;e={error:e}}}if(!r.ok){if("number"==typeof e.error?.code&&"string"==typeof e.error?.message)return e;throw new t.HttpRequestError({body:l,details:(0,s.stringify)(e.error)||r.statusText,headers:r.headers,status:r.status,url:n})}return e}catch(e){if(w?.aborted)throw(0,o.getAbortError)(w);if((0,o.isAbortError)(e)||e instanceof t.HttpRequestError||e instanceof t.TimeoutError)throw e;throw new t.HttpRequestError({body:l,cause:e,url:n})}}}}e.s(["getHttpRpcClient",0,l],915523);var c=e.i(994229);let p=0,u=new WeakMap;e.s(["http",0,function(e,o={}){let{batch:a,fetchFn:s,fetchOptions:i,key:d="http",methods:y,name:h="HTTP JSON-RPC",onFetchRequest:m,onFetchResponse:f,retryDelay:w,raw:b}=o;return({chain:g,retryCount:v,timeout:k})=>{let{batchSize:x=1e3,wait:C=0}="object"==typeof a?a:{},T=o.retryCount??v,I=k??o.timeout??1e4,W=e||g?.rpcUrls.default.http[0];if(!W)throw new r.UrlRequiredError;let P=l(W,{fetchFn:s,fetchOptions:i,onRequest:m,onResponse:f,timeout:I});return(0,c.createTransport)({key:d,methods:y,name:h,async request({method:e,params:r},o){let s={method:e,params:r},i=o?.signal?{signal:o.signal}:void 0,{schedule:l}=(0,n.createBatchScheduler)({id:`${W}.${function(e){if(!e)return"default";let t=u.get(e);if(void 0!==t)return t;let r=p++;return u.set(e,r),r}(o?.signal)}`,wait:C,shouldSplitBatch:e=>e.length>x,fn:e=>P.request({body:e,fetchOptions:i}),sort:(e,t)=>e.id-t.id}),c=async e=>a?l(e):[await P.request({body:e,fetchOptions:i})],[{error:d,result:y}]=await c(s);if(b)return{error:d,result:y};if(d)throw new t.RpcRequestError({body:s,error:d,url:W});return y},retryCount:T,retryDelay:w,timeout:I,type:"http"},{fetchOptions:i,url:W})}}],634480)},62522,883488,e=>{"use strict";function t(e){let t={formatters:void 0,fees:void 0,serializers:void 0,...e};return Object.assign(t,{extend:function e(t){return r=>{let n="function"==typeof r?r(t):r,o={...t,...n};return Object.assign(o,{extend:e(o)})}}(t)})}e.s(["defineChain",0,t,"extendSchema",0,function(){return{}}],883488);let r=t({id:1,name:"Ethereum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},blockTime:12e3,rpcUrls:{default:{http:["https://eth.merkle.io"]}},blockExplorers:{default:{name:"Etherscan",url:"https://etherscan.io",apiUrl:"https://api.etherscan.io/api"}},contracts:{ensUniversalResolver:{address:"0xeeeeeeee14d718c2b47d9923deab1335e144eeee",blockCreated:0x16041f6},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:0xdb04c1}}});e.s(["mainnet",0,r],62522)},153413,(e,t,r)=>{"use strict";var n=Object.prototype.hasOwnProperty,o="~";function a(){}function s(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function i(e,t,r,n,a){if("function"!=typeof r)throw TypeError("The listener must be a function");var i=new s(r,n||e,a),l=o?o+t:t;return e._events[l]?e._events[l].fn?e._events[l]=[e._events[l],i]:e._events[l].push(i):(e._events[l]=i,e._eventsCount++),e}function l(e,t){0==--e._eventsCount?e._events=new a:delete e._events[t]}function c(){this._events=new a,this._eventsCount=0}Object.create&&(a.prototype=Object.create(null),new a().__proto__||(o=!1)),c.prototype.eventNames=function(){var e,t,r=[];if(0===this._eventsCount)return r;for(t in e=this._events)n.call(e,t)&&r.push(o?t.slice(1):t);return Object.getOwnPropertySymbols?r.concat(Object.getOwnPropertySymbols(e)):r},c.prototype.listeners=function(e){var t=o?o+e:e,r=this._events[t];if(!r)return[];if(r.fn)return[r.fn];for(var n=0,a=r.length,s=Array(a);n<a;n++)s[n]=r[n].fn;return s},c.prototype.listenerCount=function(e){var t=o?o+e:e,r=this._events[t];return r?r.fn?1:r.length:0},c.prototype.emit=function(e,t,r,n,a,s){var i=o?o+e:e;if(!this._events[i])return!1;var l,c,p=this._events[i],u=arguments.length;if(p.fn){switch(p.once&&this.removeListener(e,p.fn,void 0,!0),u){case 1:return p.fn.call(p.context),!0;case 2:return p.fn.call(p.context,t),!0;case 3:return p.fn.call(p.context,t,r),!0;case 4:return p.fn.call(p.context,t,r,n),!0;case 5:return p.fn.call(p.context,t,r,n,a),!0;case 6:return p.fn.call(p.context,t,r,n,a,s),!0}for(c=1,l=Array(u-1);c<u;c++)l[c-1]=arguments[c];p.fn.apply(p.context,l)}else{var d,y=p.length;for(c=0;c<y;c++)switch(p[c].once&&this.removeListener(e,p[c].fn,void 0,!0),u){case 1:p[c].fn.call(p[c].context);break;case 2:p[c].fn.call(p[c].context,t);break;case 3:p[c].fn.call(p[c].context,t,r);break;case 4:p[c].fn.call(p[c].context,t,r,n);break;default:if(!l)for(d=1,l=Array(u-1);d<u;d++)l[d-1]=arguments[d];p[c].fn.apply(p[c].context,l)}}return!0},c.prototype.on=function(e,t,r){return i(this,e,t,r,!1)},c.prototype.once=function(e,t,r){return i(this,e,t,r,!0)},c.prototype.removeListener=function(e,t,r,n){var a=o?o+e:e;if(!this._events[a])return this;if(!t)return l(this,a),this;var s=this._events[a];if(s.fn)s.fn!==t||n&&!s.once||r&&s.context!==r||l(this,a);else{for(var i=0,c=[],p=s.length;i<p;i++)(s[i].fn!==t||n&&!s[i].once||r&&s[i].context!==r)&&c.push(s[i]);c.length?this._events[a]=1===c.length?c[0]:c:l(this,a)}return this},c.prototype.removeAllListeners=function(e){var t;return e?(t=o?o+e:e,this._events[t]&&l(this,t)):(this._events=new a,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=o,c.EventEmitter=c,t.exports=c},785373,50158,e=>{"use strict";var t=e.i(153413);t.default,e.s([],785373),e.s(["EventEmitter",()=>t.default],50158)},357811,e=>{"use strict";e.s(["contracts",0,{gasPriceOracle:{address:"0x420000000000000000000000000000000000000F"},l1Block:{address:"0x4200000000000000000000000000000000000015"},l2CrossDomainMessenger:{address:"0x4200000000000000000000000000000000000007"},l2Erc721Bridge:{address:"0x4200000000000000000000000000000000000014"},l2StandardBridge:{address:"0x4200000000000000000000000000000000000010"},l2ToL1MessagePasser:{address:"0x4200000000000000000000000000000000000016"}}])},498143,332294,658828,e=>{"use strict";async function t(e,t){return BigInt(await e.request({method:"eth_gasPrice",params:[t]}))}async function r(e,t){return BigInt(await e.request({method:"eth_maxPriorityFeePerGas",params:[t]}))}e.s(["fees",0,{estimateFeesPerGas:async e=>{if(!e.request?.feeCurrency)return null;let[n,o]=await Promise.all([t(e.client,e.request.feeCurrency),r(e.client,e.request.feeCurrency)]);return{maxFeePerGas:e.multiply(n-o)+o,maxPriorityFeePerGas:o}}}],498143);var n=e.i(947999),o=e.i(812127),a=e.i(156172),s=e.i(133741),i=e.i(252355);function l(e){return 0===e||0n===e||null==e||"0"===e||""===e||"string"==typeof e&&("0x"===(0,i.trim)(e).toLowerCase()||"0x00"===(0,i.trim)(e).toLowerCase())}function c(e){return!l(e)}function p(e){return"cip64"===e.type||void 0!==e.maxFeePerGas&&void 0!==e.maxPriorityFeePerGas&&c(e.feeCurrency)}e.s(["isCIP64",0,p,"isEmpty",0,l,"isPresent",0,c],332294);let u={block:(0,o.defineBlock)({format:e=>({transactions:e.transactions?.map(e=>"string"==typeof e?e:{...(0,a.formatTransaction)(e),...e.gatewayFee?{gatewayFee:(0,n.hexToBigInt)(e.gatewayFee),gatewayFeeRecipient:e.gatewayFeeRecipient}:{},feeCurrency:e.feeCurrency})})}),transaction:(0,a.defineTransaction)({format(e){if("0x7e"===e.type)return{isSystemTx:e.isSystemTx,mint:e.mint?(0,n.hexToBigInt)(e.mint):void 0,sourceHash:e.sourceHash,type:"deposit"};let t={feeCurrency:e.feeCurrency};return"0x7b"===e.type?t.type="cip64":("0x7c"===e.type&&(t.type="cip42"),t.gatewayFee=e.gatewayFee?(0,n.hexToBigInt)(e.gatewayFee):null,t.gatewayFeeRecipient=e.gatewayFeeRecipient),t}}),transactionRequest:(0,s.defineTransactionRequest)({format(e){let t={};return e.feeCurrency&&(t.feeCurrency=e.feeCurrency),p(e)&&(t.type="0x7b"),t}})};e.s(["formatters",0,u],658828)},970384,347156,690737,e=>{"use strict";var t=e.i(527755),r=e.i(914076),n=e.i(898701),o=e.i(515192),a=e.i(280789);e.s(["serializeTransaction",()=>T,"toYParitySignatureArray",()=>I],690737);var s=e.i(521938),i=e.i(983489),l=e.i(309293),c=e.i(584928),p=e.i(60523),u=e.i(252355),d=e.i(9751),y=e.i(392395),h=e.i(857874),m=e.i(264029),f=e.i(340082),w=e.i(534535),b=e.i(601095),g=e.i(855993),v=e.i(947999);function k(e){let{chainId:n,maxPriorityFeePerGas:o,maxFeePerGas:a,to:s}=e;if(n<=0)throw new f.InvalidChainIdError({chainId:n});if(s&&!(0,r.isAddress)(s))throw new t.InvalidAddressError({address:s});if(a&&a>y.maxUint256)throw new w.FeeCapTooHighError({maxFeePerGas:a});if(o&&a&&o>a)throw new w.TipAboveFeeCapError({maxFeePerGas:a,maxPriorityFeePerGas:o})}var x=e.i(758477);function C(e){if(!e||0===e.length)return[];let n=[];for(let o=0;o<e.length;o++){let{address:a,storageKeys:i}=e[o];for(let e=0;e<i.length;e++)if(i[e].length-2!=64)throw new s.InvalidStorageKeySizeError({storageKey:i[e]});if(!(0,r.isAddress)(a,{strict:!1}))throw new t.InvalidAddressError({address:a});n.push([a,i])}return n}function T(e,T){let W=(0,x.getTransactionType)(e);return"eip1559"===W?function(e,t){let{chainId:r,gas:s,nonce:i,to:l,value:c,maxFeePerGas:p,maxPriorityFeePerGas:u,accessList:d,data:y}=e;k(e);let h=C(d),m=[(0,o.numberToHex)(r),i?(0,o.numberToHex)(i):"0x",u?(0,o.numberToHex)(u):"0x",p?(0,o.numberToHex)(p):"0x",s?(0,o.numberToHex)(s):"0x",l??"0x",c?(0,o.numberToHex)(c):"0x",y??"0x",h,...I(e,t)];return(0,n.concatHex)(["0x02",(0,a.toRlp)(m)])}(e,T):"eip2930"===W?function(e,s){let{chainId:i,gas:l,data:c,nonce:p,to:u,value:d,accessList:m,gasPrice:b}=e;!function(e){let{chainId:n,maxPriorityFeePerGas:o,gasPrice:a,maxFeePerGas:s,to:i}=e;if(n<=0)throw new f.InvalidChainIdError({chainId:n});if(i&&!(0,r.isAddress)(i))throw new t.InvalidAddressError({address:i});if(o||s)throw new h.BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");if(a&&a>y.maxUint256)throw new w.FeeCapTooHighError({maxFeePerGas:a})}(e);let g=C(m),v=[(0,o.numberToHex)(i),p?(0,o.numberToHex)(p):"0x",b?(0,o.numberToHex)(b):"0x",l?(0,o.numberToHex)(l):"0x",u??"0x",d?(0,o.numberToHex)(d):"0x",c??"0x",g,...I(e,s)];return(0,n.concatHex)(["0x01",(0,a.toRlp)(v)])}(e,T):"eip4844"===W?function(e,t){let{chainId:r,gas:s,nonce:u,to:y,value:h,maxFeePerBlobGas:f,maxFeePerGas:w,maxPriorityFeePerGas:x,accessList:T,data:W}=e;!function(e){let{blobVersionedHashes:t}=e;if(t){if(0===t.length)throw new m.EmptyBlobError;for(let e of t){let t=(0,b.size)(e),r=(0,v.hexToNumber)((0,g.slice)(e,0,1));if(32!==t)throw new m.InvalidVersionedHashSizeError({hash:e,size:t});if(r!==d.versionedHashVersionKzg)throw new m.InvalidVersionedHashVersionError({hash:e,version:r})}}k(e)}(e);let P=e.blobVersionedHashes,_=e.sidecars;if(e.blobs&&(void 0===P||void 0===_)){let t="string"==typeof e.blobs[0]?e.blobs:e.blobs.map(e=>(0,o.bytesToHex)(e)),r=e.kzg,n=(0,i.blobsToCommitments)({blobs:t,kzg:r});if(void 0===P&&(P=(0,c.commitmentsToVersionedHashes)({commitments:n})),void 0===_){let e=(0,l.blobsToProofs)({blobs:t,commitments:n,kzg:r});_=(0,p.toBlobSidecars)({blobs:t,commitments:n,proofs:e})}}let A=C(T),O=[(0,o.numberToHex)(r),u?(0,o.numberToHex)(u):"0x",x?(0,o.numberToHex)(x):"0x",w?(0,o.numberToHex)(w):"0x",s?(0,o.numberToHex)(s):"0x",y??"0x",h?(0,o.numberToHex)(h):"0x",W??"0x",A,f?(0,o.numberToHex)(f):"0x",P??[],...I(e,t)],E=[],R=[],j=[];if(_)for(let e=0;e<_.length;e++){let{blob:t,commitment:r,proof:n}=_[e];E.push(t),R.push(r),j.push(n)}return(0,n.concatHex)(["0x03",_?(0,a.toRlp)([O,E,R,j]):(0,a.toRlp)(O)])}(e,T):"eip7702"===W?function(e,s){let{authorizationList:i,chainId:l,gas:c,nonce:p,to:u,value:d,maxFeePerGas:y,maxPriorityFeePerGas:h,accessList:m,data:w}=e;!function(e){let{authorizationList:n}=e;if(n)for(let e of n){let{chainId:n}=e,o=e.address;if(!(0,r.isAddress)(o))throw new t.InvalidAddressError({address:o});if(n<0)throw new f.InvalidChainIdError({chainId:n})}k(e)}(e);let b=C(m),g=function(e){if(!e||0===e.length)return[];let t=[];for(let r of e){let{chainId:e,nonce:n,...a}=r,s=r.address;t.push([e?(0,o.toHex)(e):"0x",s,n?(0,o.toHex)(n):"0x",...I({},a)])}return t}(i);return(0,n.concatHex)(["0x04",(0,a.toRlp)([(0,o.numberToHex)(l),p?(0,o.numberToHex)(p):"0x",h?(0,o.numberToHex)(h):"0x",y?(0,o.numberToHex)(y):"0x",c?(0,o.numberToHex)(c):"0x",u??"0x",d?(0,o.numberToHex)(d):"0x",w??"0x",b,g,...I(e,s)])])}(e,T):function(e,n){let{chainId:i=0,gas:l,data:c,nonce:p,to:d,value:m,gasPrice:b}=e;!function(e){let{chainId:n,maxPriorityFeePerGas:o,gasPrice:a,maxFeePerGas:s,to:i}=e;if(i&&!(0,r.isAddress)(i))throw new t.InvalidAddressError({address:i});if(void 0!==n&&n<=0)throw new f.InvalidChainIdError({chainId:n});if(o||s)throw new h.BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");if(a&&a>y.maxUint256)throw new w.FeeCapTooHighError({maxFeePerGas:a})}(e);let g=[p?(0,o.numberToHex)(p):"0x",b?(0,o.numberToHex)(b):"0x",l?(0,o.numberToHex)(l):"0x",d??"0x",m?(0,o.numberToHex)(m):"0x",c??"0x"];if(n){let e=(()=>{if(n.v>=35n)return(n.v-35n)/2n>0?n.v:27n+(35n===n.v?0n:1n);if(i>0)return BigInt(2*i)+BigInt(35n+n.v-27n);let e=27n+(27n===n.v?0n:1n);if(n.v!==e)throw new s.InvalidLegacyVError({v:n.v});return e})(),t=(0,u.trim)(n.r),r=(0,u.trim)(n.s);g=[...g,(0,o.numberToHex)(e),"0x00"===t?"0x":t,"0x00"===r?"0x":r]}else i>0&&(g=[...g,(0,o.numberToHex)(i),"0x","0x"]);return(0,a.toRlp)(g)}(e,T)}function I(e,t){let r=t??e,{v:n,yParity:a}=r;if(void 0===r.r||void 0===r.s||void 0===n&&void 0===a)return[];let s=(0,u.trim)(r.r),i=(0,u.trim)(r.s);return["number"==typeof a?a?(0,o.numberToHex)(1):"0x":0n===n?"0x":1n===n?(0,o.numberToHex)(1):27n===n?"0x":(0,o.numberToHex)(1),"0x00"===s?"0x":s,"0x00"===i?"0x":i]}function W(e,s){var i;return"deposit"===(i=e).type||void 0!==i.sourceHash?function(e){!function(e){let{from:n,to:o}=e;if(n&&!(0,r.isAddress)(n))throw new t.InvalidAddressError({address:n});if(o&&!(0,r.isAddress)(o))throw new t.InvalidAddressError({address:o})}(e);let{sourceHash:s,data:i,from:l,gas:c,isSystemTx:p,mint:u,to:d,value:y}=e,h=[s,l,d??"0x",u?(0,o.toHex)(u):"0x",y?(0,o.toHex)(y):"0x",c?(0,o.toHex)(c):"0x",p?"0x1":"0x",i??"0x"];return(0,n.concatHex)(["0x7e",(0,a.toRlp)(h)])}(e):T(e,s)}e.s(["serializeAccessList",0,C],347156),e.s(["serializeTransaction",0,W,"serializers",0,{transaction:W}],970384)},925025,921055,438819,e=>{"use strict";var t=e.i(357811),r=e.i(498143),n=e.i(658828),o=e.i(392395),a=e.i(527755),s=e.i(857874),i=e.i(340082),l=e.i(534535),c=e.i(970384),p=e.i(914076),u=e.i(898701),d=e.i(515192),y=e.i(280789),h=e.i(347156),m=e.i(690737),f=e.i(332294);let w=o.maxUint256,b={blockTime:1e3,contracts:t.contracts,formatters:n.formatters,serializers:{transaction:function(e,t){return(0,f.isCIP64)(e)?function(e,t){!function(e){let{chainId:t,maxPriorityFeePerGas:r,gasPrice:n,maxFeePerGas:o,to:c,feeCurrency:u}=e;if(t<=0)throw new i.InvalidChainIdError({chainId:t});if(c&&!(0,p.isAddress)(c))throw new a.InvalidAddressError({address:c});if(n)throw new s.BaseError("`gasPrice` is not a valid CIP-64 Transaction attribute.");if((0,f.isPresent)(o)&&o>w)throw new l.FeeCapTooHighError({maxFeePerGas:o});if((0,f.isPresent)(r)&&(0,f.isPresent)(o)&&r>o)throw new l.TipAboveFeeCapError({maxFeePerGas:o,maxPriorityFeePerGas:r});if((0,f.isPresent)(u)&&!(0,p.isAddress)(u))throw new s.BaseError("`feeCurrency` MUST be a token address for CIP-64 transactions.");if((0,f.isEmpty)(u))throw new s.BaseError("`feeCurrency` must be provided for CIP-64 transactions.")}(e);let{chainId:r,gas:n,nonce:o,to:c,value:b,maxFeePerGas:g,maxPriorityFeePerGas:v,accessList:k,feeCurrency:x,data:C}=e,T=[(0,d.toHex)(r),o?(0,d.toHex)(o):"0x",v?(0,d.toHex)(v):"0x",g?(0,d.toHex)(g):"0x",n?(0,d.toHex)(n):"0x",c??"0x",b?(0,d.toHex)(b):"0x",C??"0x",(0,h.serializeAccessList)(k),x,...(0,m.toYParitySignatureArray)(e,t)];return(0,u.concatHex)(["0x7b",(0,y.toRlp)(T)])}(e,t):(0,c.serializeTransaction)(e,t)}},fees:r.fees};e.s(["chainConfig",0,b],921055);var g=e.i(883488);let v=(0,g.defineChain)({...b,id:42220,name:"Celo",nativeCurrency:{decimals:18,name:"CELO",symbol:"CELO"},rpcUrls:{default:{http:["https://forno.celo.org"]}},blockExplorers:{default:{name:"Celo Explorer",url:"https://celoscan.io",apiUrl:"https://api.celoscan.io/api"}},contracts:{multicall3:{address:"0xcA11bde05977b3631167028862bE2a173976CA11",blockCreated:0xc81517}},testnet:!1});e.s(["celo",0,v],925025);let k=(0,g.defineChain)({...b,id:0xaa044c,name:"Celo Sepolia Testnet",nativeCurrency:{decimals:18,name:"CELO",symbol:"S-CELO"},rpcUrls:{default:{http:["https://forno.celo-sepolia.celo-testnet.org"]}},blockExplorers:{default:{name:"Celo Sepolia Explorer",url:"https://celo-sepolia.blockscout.com/",apiUrl:"https://celo-sepolia.blockscout.com/api"}},contracts:{...b.contracts,multicall3:{address:"0xcA11bde05977b3631167028862bE2a173976CA11",blockCreated:1},portal:{0xaa36a7:{address:"0x44ae3d41a335a7d05eb533029917aad35662dcc2",blockCreated:8825790}},disputeGameFactory:{0xaa36a7:{address:"0x57c45d82d1a995f1e135b8d7edc0a6bb5211cfaa",blockCreated:8825790}},l1StandardBridge:{0xaa36a7:{address:"0xec18a3c30131a0db4246e785355fbc16e2eaf408",blockCreated:8825790}}},testnet:!0});e.s(["celoSepolia",0,k],438819)},877183,e=>{e.v(t=>Promise.all(["static/chunks/1fmq9prq45adr.js"].map(t=>e.l(t))).then(()=>t(136032)))},313886,e=>{e.v(e=>Promise.resolve().then(()=>e(300059)))},804397,e=>{e.v(t=>Promise.all(["static/chunks/43q4tlpb028af.js","static/chunks/40nguo402_d20.js","static/chunks/0c2-_z-z1ga-e.js","static/chunks/0f9f78hjz0gy2.js"].map(t=>e.l(t))).then(()=>t(645419)))},110587,e=>{e.v(t=>Promise.all(["static/chunks/12vjuj_96e8e8.js","static/chunks/20xagreiw7_lw.js"].map(t=>e.l(t))).then(()=>t(108963)))},626411,e=>{e.v(t=>Promise.all(["static/chunks/0fw-wkpu4j_kb.js"].map(t=>e.l(t))).then(()=>t(44055)))},306792,e=>{e.v(t=>Promise.all(["static/chunks/04wcv5gsedjrh.js"].map(t=>e.l(t))).then(()=>t(642505)))},910305,e=>{e.v(t=>Promise.all(["static/chunks/1yxcnsjipbt4p.js","static/chunks/1z5w7rbylken0.js"].map(t=>e.l(t))).then(()=>t(124744)))},911055,e=>{e.v(t=>Promise.all(["static/chunks/0m7ux2tsgpzwj.js"].map(t=>e.l(t))).then(()=>t(966735)))},126816,e=>{e.v(t=>Promise.all(["static/chunks/37yxd6pvs_imm.js"].map(t=>e.l(t))).then(()=>t(560920)))},287800,e=>{e.v(t=>Promise.all(["static/chunks/2z1-g4r1h-x9c.js"].map(t=>e.l(t))).then(()=>t(299090)))},62685,e=>{e.v(t=>Promise.all(["static/chunks/0k6377z8kpyq6.js"].map(t=>e.l(t))).then(()=>t(238823)))},653729,e=>{e.v(t=>Promise.all(["static/chunks/3060p4lk-9nvi.js"].map(t=>e.l(t))).then(()=>t(954261)))},506631,e=>{e.v(t=>Promise.all(["static/chunks/2rxg4lsds4tmq.js"].map(t=>e.l(t))).then(()=>t(326349)))},211728,e=>{e.v(t=>Promise.all(["static/chunks/2gy1zvdvh3ic9.js"].map(t=>e.l(t))).then(()=>t(801329)))},357266,e=>{e.v(t=>Promise.all(["static/chunks/0lmr5f79u7mo7.js"].map(t=>e.l(t))).then(()=>t(47079)))},308226,e=>{e.v(t=>Promise.all(["static/chunks/32_h_fusjhgfy.js"].map(t=>e.l(t))).then(()=>t(983732)))},242830,e=>{e.v(t=>Promise.all(["static/chunks/3usei3v3oumdr.js"].map(t=>e.l(t))).then(()=>t(757860)))},212481,e=>{e.v(t=>Promise.all(["static/chunks/155geoa384414.js"].map(t=>e.l(t))).then(()=>t(110732)))},935732,e=>{e.v(t=>Promise.all(["static/chunks/1lzv3ph2mhqge.js"].map(t=>e.l(t))).then(()=>t(914872)))},871242,e=>{e.v(t=>Promise.all(["static/chunks/2an6ml-eeizs4.js"].map(t=>e.l(t))).then(()=>t(730930)))},771823,e=>{e.v(t=>Promise.all(["static/chunks/2ts4voyj2-7od.js"].map(t=>e.l(t))).then(()=>t(545748)))},436247,e=>{e.v(t=>Promise.all(["static/chunks/38mofynbkxw0p.js"].map(t=>e.l(t))).then(()=>t(279583)))},824968,e=>{e.v(t=>Promise.all(["static/chunks/3o8200zvn_r0o.js"].map(t=>e.l(t))).then(()=>t(57011)))},850309,e=>{e.v(t=>Promise.all(["static/chunks/3o46jbr6bz8tn.js"].map(t=>e.l(t))).then(()=>t(365527)))},835353,e=>{e.v(t=>Promise.all(["static/chunks/12hzk-j-gdmxi.js"].map(t=>e.l(t))).then(()=>t(435503)))},137744,e=>{e.v(t=>Promise.all(["static/chunks/1kmszwzz4wqfx.js"].map(t=>e.l(t))).then(()=>t(262271)))},302273,e=>{e.v(t=>Promise.all(["static/chunks/3mt3td5q5paqx.js"].map(t=>e.l(t))).then(()=>t(785986)))},741277,e=>{e.v(t=>Promise.all(["static/chunks/2k27javjnu__u.js"].map(t=>e.l(t))).then(()=>t(789208)))},631756,e=>{e.v(t=>Promise.all(["static/chunks/07ge5gnl9x3x5.js"].map(t=>e.l(t))).then(()=>t(79699)))},626019,e=>{e.v(t=>Promise.all(["static/chunks/02oivhoser_ee.js"].map(t=>e.l(t))).then(()=>t(528458)))},128684,e=>{e.v(t=>Promise.all(["static/chunks/07zlp8z0k79h6.js"].map(t=>e.l(t))).then(()=>t(90812)))},794824,e=>{e.v(t=>Promise.all(["static/chunks/3uip290y4bxmg.js"].map(t=>e.l(t))).then(()=>t(204771)))},798403,e=>{e.v(t=>Promise.all(["static/chunks/36dnhwctk9z99.js"].map(t=>e.l(t))).then(()=>t(642197)))},744259,e=>{e.v(t=>Promise.all(["static/chunks/1hp7ymzbep8ri.js"].map(t=>e.l(t))).then(()=>t(716709)))},89007,e=>{e.v(t=>Promise.all(["static/chunks/39sjk0nesj2cr.js"].map(t=>e.l(t))).then(()=>t(875516)))},134139,e=>{e.v(t=>Promise.all(["static/chunks/18wjex9r61o78.js"].map(t=>e.l(t))).then(()=>t(387948)))},118053,e=>{e.v(t=>Promise.all(["static/chunks/1vzspufacuw6w.js"].map(t=>e.l(t))).then(()=>t(403247)))},98241,e=>{e.v(t=>Promise.all(["static/chunks/034dhd5vvj068.js"].map(t=>e.l(t))).then(()=>t(291036)))},177829,e=>{e.v(t=>Promise.all(["static/chunks/3y29504pz08x4.js"].map(t=>e.l(t))).then(()=>t(559411)))},570925,e=>{e.v(t=>Promise.all(["static/chunks/23-7ykfuwg0sj.js"].map(t=>e.l(t))).then(()=>t(501513)))},512964,e=>{e.v(t=>Promise.all(["static/chunks/3iqtobn19cekm.js"].map(t=>e.l(t))).then(()=>t(491013)))},37311,e=>{e.v(t=>Promise.all(["static/chunks/2rhlb1nq-v6t8.js"].map(t=>e.l(t))).then(()=>t(543825)))},814190,e=>{e.v(t=>Promise.all(["static/chunks/2h9590e_8hspm.js"].map(t=>e.l(t))).then(()=>t(83147)))},473797,e=>{e.v(t=>Promise.all(["static/chunks/14vxcc5b3v3e2.js"].map(t=>e.l(t))).then(()=>t(624486)))},962883,e=>{e.v(t=>Promise.all(["static/chunks/3s523u274r07u.js"].map(t=>e.l(t))).then(()=>t(966017)))},3401,e=>{e.v(t=>Promise.all(["static/chunks/3mab3zc7rxuwj.js"].map(t=>e.l(t))).then(()=>t(421806)))},305399,e=>{e.v(t=>Promise.all(["static/chunks/3a2vv1ej-kpi2.js"].map(t=>e.l(t))).then(()=>t(965555)))},78619,e=>{e.v(t=>Promise.all(["static/chunks/378nwv3v4ao_v.js"].map(t=>e.l(t))).then(()=>t(407924)))},965690,e=>{e.v(t=>Promise.all(["static/chunks/1egg9f0fqggon.js"].map(t=>e.l(t))).then(()=>t(722718)))},468126,e=>{e.v(t=>Promise.all(["static/chunks/2cylniot2khai.js"].map(t=>e.l(t))).then(()=>t(547544)))},767615,e=>{e.v(t=>Promise.all(["static/chunks/2yj0d-qujs2l9.js"].map(t=>e.l(t))).then(()=>t(979240)))},7959,e=>{e.v(t=>Promise.all(["static/chunks/39oote8jqdz3i.js"].map(t=>e.l(t))).then(()=>t(168824)))},580216,e=>{e.v(t=>Promise.all(["static/chunks/3b229y6_a7w43.js"].map(t=>e.l(t))).then(()=>t(913788)))},784489,e=>{e.v(t=>Promise.all(["static/chunks/0yb66ehu8qady.js"].map(t=>e.l(t))).then(()=>t(204277)))},26977,e=>{e.v(t=>Promise.all(["static/chunks/1_gfgqrft3yf3.js"].map(t=>e.l(t))).then(()=>t(522865)))},823623,e=>{e.v(t=>Promise.all(["static/chunks/1ad_o1-edng8w.js"].map(t=>e.l(t))).then(()=>t(241850)))},24931,e=>{e.v(t=>Promise.all(["static/chunks/32kzxepyl7emh.js"].map(t=>e.l(t))).then(()=>t(443405)))},651985,e=>{e.v(t=>Promise.all(["static/chunks/055uf6fl3rqi6.js"].map(t=>e.l(t))).then(()=>t(722757)))},960086,e=>{e.v(t=>Promise.all(["static/chunks/1d2uk4o867pdq.js"].map(t=>e.l(t))).then(()=>t(153393)))},173836,e=>{e.v(t=>Promise.all(["static/chunks/3ylkifglgx3vy.js"].map(t=>e.l(t))).then(()=>t(990559)))},985691,e=>{e.v(t=>Promise.all(["static/chunks/1sqlrmb51dp6n.js"].map(t=>e.l(t))).then(()=>t(718052)))},357917,e=>{e.v(t=>Promise.all(["static/chunks/2uid8zaz7ca-i.js"].map(t=>e.l(t))).then(()=>t(485001)))},716860,e=>{e.v(t=>Promise.all(["static/chunks/31vv0v84zhe32.js"].map(t=>e.l(t))).then(()=>t(699998)))},603644,e=>{e.v(t=>Promise.all(["static/chunks/1kgwy_g0sv147.js"].map(t=>e.l(t))).then(()=>t(952963)))},349792,e=>{e.v(t=>Promise.all(["static/chunks/0f0ib44zd-zp2.js"].map(t=>e.l(t))).then(()=>t(87048)))},311983,e=>{e.v(t=>Promise.all(["static/chunks/0j8g5wurmtfwl.js"].map(t=>e.l(t))).then(()=>t(244719)))},106996,e=>{e.v(t=>Promise.all(["static/chunks/2tilt82pex4aj.js"].map(t=>e.l(t))).then(()=>t(876112)))},273972,e=>{e.v(t=>Promise.all(["static/chunks/2zztzvsm7vzhv.js"].map(t=>e.l(t))).then(()=>t(481055)))},265896,e=>{e.v(t=>Promise.all(["static/chunks/0qf7hvssk19uq.js"].map(t=>e.l(t))).then(()=>t(177704)))},234009,e=>{e.v(t=>Promise.all(["static/chunks/25fn7q-z8zus-.js"].map(t=>e.l(t))).then(()=>t(584811)))},346569,e=>{e.v(t=>Promise.all(["static/chunks/38-5-mzupfabn.js"].map(t=>e.l(t))).then(()=>t(493151)))},401981,e=>{e.v(t=>Promise.all(["static/chunks/0m9zompg5frnb.js"].map(t=>e.l(t))).then(()=>t(875678)))},932608,e=>{e.v(t=>Promise.all(["static/chunks/00nh6eslabbe8.js"].map(t=>e.l(t))).then(()=>t(139926)))},414281,e=>{e.v(t=>Promise.all(["static/chunks/2w7di91hkzqgi.js"].map(t=>e.l(t))).then(()=>t(101331)))},580003,e=>{e.v(t=>Promise.all(["static/chunks/0kqt-zb0_a14_.js"].map(t=>e.l(t))).then(()=>t(664852)))},992036,e=>{e.v(t=>Promise.all(["static/chunks/3xgmg7oswc70v.js"].map(t=>e.l(t))).then(()=>t(608427)))},194967,e=>{e.v(t=>Promise.all(["static/chunks/4101a47-fyspc.js"].map(t=>e.l(t))).then(()=>t(946555)))},334581,e=>{e.v(t=>Promise.all(["static/chunks/1y6t_hzgnv1gx.js"].map(t=>e.l(t))).then(()=>t(121864)))},239464,e=>{e.v(t=>Promise.all(["static/chunks/1xhgtl2l55yn6.js"].map(t=>e.l(t))).then(()=>t(510651)))},803925,e=>{e.v(t=>Promise.all(["static/chunks/1hsw116tsgoq-.js"].map(t=>e.l(t))).then(()=>t(692871)))},291267,e=>{e.v(t=>Promise.all(["static/chunks/2tgsz3cio84x6.js"].map(t=>e.l(t))).then(()=>t(283852)))},525986,e=>{e.v(t=>Promise.all(["static/chunks/19m82t71v-naq.js"].map(t=>e.l(t))).then(()=>t(405940)))},149457,e=>{e.v(t=>Promise.all(["static/chunks/1_btcz-fksb9q.js"].map(t=>e.l(t))).then(()=>t(181457)))}]);