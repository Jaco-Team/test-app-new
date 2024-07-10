"use strict";(self.webpackChunktest_app_new=self.webpackChunktest_app_new||[]).push([[1441],{"./stories/MyButton/MyButton.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Auth:()=>Auth,Cart:()=>Cart,City:()=>City,Modal:()=>Modal,Modal_Active:()=>Modal_Active,Primary:()=>Primary,Secondary:()=>Secondary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _Primary_parameters,_Primary_parameters_docs,_Primary_parameters1,_Secondary_parameters,_Secondary_parameters_docs,_Secondary_parameters1,_City_parameters,_City_parameters_docs,_City_parameters1,_Auth_parameters,_Auth_parameters_docs,_Auth_parameters1,_Modal_parameters,_Modal_parameters_docs,_Modal_parameters1,_Modal_Active_parameters,_Modal_Active_parameters_docs,_Modal_Active_parameters1,_Cart_parameters,_Cart_parameters_docs,_Cart_parameters1,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),_MyButton__WEBPACK_IMPORTED_MODULE_2__=(__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),__webpack_require__("./stories/MyButton/MyButton.jsx"));const __WEBPACK_DEFAULT_EXPORT__={title:"Элементы / Кнопки",component:_MyButton__WEBPACK_IMPORTED_MODULE_2__.J,tags:["autodocs"],argTypes:{variant:{type:"string",description:"Вариант заливки кнопки",defaultValue:"primary",control:{type:"radio"},options:["primary","secondary","city","auth","cart"],if:{arg:"element",neq:"modal"}},size:{type:"string",description:"Ширина кнопки 240 / 320 / 400",defaultValue:"medium",control:{type:"radio"},options:["small","medium","large","big"],if:{arg:"variant",neq:"modal"}},arrow:{type:"boolean",description:"Наличие стрелки в кнопке",if:{arg:"variant",eq:"city"}},isOpen:{type:"boolean",description:"Отслеживание нажатия кнопки",if:{arg:"variant",eq:"city"}},children:{type:"node",description:"Текст в кнопке"},element:{type:"string",description:"Элемент в котором используется кнопка",if:{arg:"variant",eq:"modal"}},count:{type:"number",description:"Количество товара",if:{arg:"variant",eq:"modal"}},typeModal:{type:"string",description:"Тип модального окна",if:{arg:"variant",eq:"modal"}}}},Template=args=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_MyButton__WEBPACK_IMPORTED_MODULE_2__.J,{...args}),Primary=Template.bind({}),Secondary=Template.bind({}),City=Template.bind({}),Auth=Template.bind({}),Modal=Template.bind({}),Modal_Active=Template.bind({}),Cart=Template.bind({});Primary.args={variant:"primary",size:"medium",children:"Press me",arrow:!1,isOpen:!1},Secondary.args={variant:"secondary",size:"medium",children:"Press me",arrow:!1,isOpen:!1},City.args={variant:"city",size:"medium",children:"Press me",arrow:!0,isOpen:!1},Auth.args={variant:"auth",size:"medium",children:"Press me",arrow:!1,isOpen:!1},Cart.args={variant:"cart",size:"big",children:"Press me",arrow:!1,isOpen:!1},Modal.args={variant:"modal",children:"500",count:0,typeModal:"start",element:"modal"},Modal_Active.args={variant:"modal",children:"",count:1,typeModal:"start",element:"modal"},Primary.parameters={...Primary.parameters,docs:{...null===(_Primary_parameters=Primary.parameters)||void 0===_Primary_parameters?void 0:_Primary_parameters.docs,source:{originalSource:"args => <MyButton {...args} />",...null===(_Primary_parameters1=Primary.parameters)||void 0===_Primary_parameters1||null===(_Primary_parameters_docs=_Primary_parameters1.docs)||void 0===_Primary_parameters_docs?void 0:_Primary_parameters_docs.source}}},Secondary.parameters={...Secondary.parameters,docs:{...null===(_Secondary_parameters=Secondary.parameters)||void 0===_Secondary_parameters?void 0:_Secondary_parameters.docs,source:{originalSource:"args => <MyButton {...args} />",...null===(_Secondary_parameters1=Secondary.parameters)||void 0===_Secondary_parameters1||null===(_Secondary_parameters_docs=_Secondary_parameters1.docs)||void 0===_Secondary_parameters_docs?void 0:_Secondary_parameters_docs.source}}},City.parameters={...City.parameters,docs:{...null===(_City_parameters=City.parameters)||void 0===_City_parameters?void 0:_City_parameters.docs,source:{originalSource:"args => <MyButton {...args} />",...null===(_City_parameters1=City.parameters)||void 0===_City_parameters1||null===(_City_parameters_docs=_City_parameters1.docs)||void 0===_City_parameters_docs?void 0:_City_parameters_docs.source}}},Auth.parameters={...Auth.parameters,docs:{...null===(_Auth_parameters=Auth.parameters)||void 0===_Auth_parameters?void 0:_Auth_parameters.docs,source:{originalSource:"args => <MyButton {...args} />",...null===(_Auth_parameters1=Auth.parameters)||void 0===_Auth_parameters1||null===(_Auth_parameters_docs=_Auth_parameters1.docs)||void 0===_Auth_parameters_docs?void 0:_Auth_parameters_docs.source}}},Modal.parameters={...Modal.parameters,docs:{...null===(_Modal_parameters=Modal.parameters)||void 0===_Modal_parameters?void 0:_Modal_parameters.docs,source:{originalSource:"args => <MyButton {...args} />",...null===(_Modal_parameters1=Modal.parameters)||void 0===_Modal_parameters1||null===(_Modal_parameters_docs=_Modal_parameters1.docs)||void 0===_Modal_parameters_docs?void 0:_Modal_parameters_docs.source}}},Modal_Active.parameters={...Modal_Active.parameters,docs:{...null===(_Modal_Active_parameters=Modal_Active.parameters)||void 0===_Modal_Active_parameters?void 0:_Modal_Active_parameters.docs,source:{originalSource:"args => <MyButton {...args} />",...null===(_Modal_Active_parameters1=Modal_Active.parameters)||void 0===_Modal_Active_parameters1||null===(_Modal_Active_parameters_docs=_Modal_Active_parameters1.docs)||void 0===_Modal_Active_parameters_docs?void 0:_Modal_Active_parameters_docs.source}}},Cart.parameters={...Cart.parameters,docs:{...null===(_Cart_parameters=Cart.parameters)||void 0===_Cart_parameters?void 0:_Cart_parameters.docs,source:{originalSource:"args => <MyButton {...args} />",...null===(_Cart_parameters1=Cart.parameters)||void 0===_Cart_parameters1||null===(_Cart_parameters_docs=_Cart_parameters1.docs)||void 0===_Cart_parameters_docs?void 0:_Cart_parameters_docs.source}}};const __namedExportsOrder=["Primary","Secondary","City","Auth","Modal","Modal_Active","Cart"]},"./stories/MyButton/MyButton.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>MyButton_MyButton_MyButton});var jsx_runtime=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),MyButton=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[14].use[1]!./node_modules/postcss-loader/dist/cjs.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[14].use[4]!./stories/MyButton/MyButton.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(MyButton.A,options);MyButton.A&&MyButton.A.locals&&MyButton.A.locals;var Icons=__webpack_require__("./stories/Icons.js");const MyButton_MyButton_MyButton=param=>{let{variant,size,children,arrow,isOpen,typeModal,element,count,...props}=param;if(!element){const back="city"===variant&&isOpen?"rgba(0, 0, 0, 0.05)":"primary"===variant||"cart"===variant?"#da1a32":"auth"===variant?"rgba(0, 0, 0, 0.1)":"#fff";return(0,jsx_runtime.jsxs)("button",{type:"button",className:["MyButton",variant,size].join(" "),style:{backgroundColor:back},...props,children:[(0,jsx_runtime.jsx)("span",{children}),!!arrow&&(isOpen?(0,jsx_runtime.jsx)(Icons.Xv,{style:{transform:"rotate(180deg)"}}):(0,jsx_runtime.jsx)(Icons.Xv,{}))]})}if("modal"===element)return(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:0===count?(0,jsx_runtime.jsxs)("button",{className:"modalBTN",disabled:"start"!==typeModal,children:[new Intl.NumberFormat("ru-RU").format(children)," ₽"]}):(0,jsx_runtime.jsxs)("div",{className:"containerModalBTN",children:[(0,jsx_runtime.jsx)("button",{disabled:"start"!==typeModal,children:"–"}),(0,jsx_runtime.jsx)("span",{children:count}),(0,jsx_runtime.jsx)("button",{disabled:"start"!==typeModal,children:"+"})]})})};MyButton_MyButton_MyButton.propTypes={variant:prop_types_default().oneOf(["primary","secondary","city","auth","cart"]),size:prop_types_default().oneOf(["small","medium","large","big"]),children:prop_types_default().node,typeModal:prop_types_default().string.isRequired,count:prop_types_default().number,element:prop_types_default().string.isRequired},MyButton_MyButton_MyButton.__docgenInfo={description:"",methods:[],displayName:"MyButton",props:{variant:{description:"",type:{name:"enum",value:[{value:"'primary'",computed:!1},{value:"'secondary'",computed:!1},{value:"'city'",computed:!1},{value:"'auth'",computed:!1},{value:"'cart'",computed:!1}]},required:!1},size:{description:"",type:{name:"enum",value:[{value:"'small'",computed:!1},{value:"'medium'",computed:!1},{value:"'large'",computed:!1},{value:"'big'",computed:!1}]},required:!1},children:{description:"",type:{name:"node"},required:!1},typeModal:{description:"",type:{name:"string"},required:!0},count:{description:"",type:{name:"number"},required:!1},element:{description:"",type:{name:"string"},required:!0}}}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[14].use[1]!./node_modules/postcss-loader/dist/cjs.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[14].use[4]!./stories/MyButton/MyButton.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".MyButton{border-radius:1.4440433213vw;border:0px solid #fff;cursor:pointer;font-size:1.155234657vw !important;font-family:var(--inter-font) !important;color:rgba(0,0,0,.8);font-style:normal;font-weight:400}.MyButton.primary{color:#fff}.MyButton.primary *{color:#fff}.MyButton.primary:hover{background-color:#c7172d !important}.MyButton.primary:active{background-color:#b11528 !important}.MyButton.secondary{border:0.0722021661vw solid #da1a32;color:#da1a32}.MyButton.secondary *{color:#da1a32}.MyButton.secondary:hover{background-color:rgba(0,0,0,.05) !important;border-color:#c7172d;color:#c7172d}.MyButton.secondary:hover *{color:#c7172d}.MyButton.secondary:active{background-color:#b11528 !important;border-color:#b11528;color:#fff}.MyButton.secondary:active *{color:#fff}.MyButton.auth{color:#fff}.MyButton.auth *{color:#fff}.MyButton.auth:hover,.MyButton.auth :active{background-color:rgba(0,0,0,.2) !important}.MyButton.city{display:flex;align-items:center;position:relative;border:0.1083032491vw solid rgba(0,0,0,.2);color:rgba(0,0,0,.8)}.MyButton.city *{color:rgba(0,0,0,.8)}.MyButton.city:hover{background-color:rgba(0,0,0,.05) !important;border-color:rgba(0,0,0,.2);color:rgba(0,0,0,.8)}.MyButton.city:hover *{color:rgba(0,0,0,.8)}.MyButton.city:active{background-color:rgba(0,0,0,.05) !important;border-color:rgba(0,0,0,.2);color:rgba(0,0,0,.8)}.MyButton.city:active *{color:rgba(0,0,0,.8)}.MyButton.city span{margin-right:auto;margin-left:auto}.MyButton.city svg{position:absolute;width:0.7220216606vw;height:0.7220216606vw;right:1.083032491vw}.MyButton.cart{color:#fff !important;font-size:1.083032491vw !important;font-family:var(--inter-font) !important;color:rgba(0,0,0,.8);font-style:normal;font-weight:400;margin-bottom:6.1371841155vw}.MyButton.small{width:8.6642599278vw;height:2.8880866426vw}.MyButton.medium{width:11.5523465704vw;height:2.8880866426vw}.MyButton.large{width:14.440433213vw;height:2.8880866426vw}.MyButton.big{width:20.2166064982vw;height:2.8880866426vw}.modalBTN{border:0.1083032491vw solid rgba(0,0,0,.2);width:14.440433213vw;border-radius:1.6245487365vw;color:rgba(0,0,0,.6) !important;height:2.8880866426vw;padding:0;background-color:rgba(0,0,0,0);font-size:1.083032491vw !important;font-family:var(--inter-font) !important;color:rgba(0,0,0,.8);font-style:normal;font-weight:400;white-space:nowrap;cursor:pointer}.modalBTN:hover{background-color:#f2f2f2;border:0.0722021661vw solid #ccc}.modalBTN:target{background-color:#f2f2f2;border:0.0722021661vw solid #ccc}.modalBTN:active{background-color:#f2f2f2;border:0.0722021661vw solid #ccc}button:disabled,button[disabled]{pointer-events:none;cursor:unset}.containerModalBTN{width:14.2238267148vw;border-radius:1.6245487365vw;display:flex;justify-content:space-between;align-items:center;height:2.6714801444vw;border:0.1083032491vw solid rgba(0,0,0,.2);background-color:rgba(0,0,0,0)}.containerModalBTN>button{padding:0;border:none;background-color:rgba(0,0,0,.07);mix-blend-mode:multiply;font-size:1.8050541516vw !important;font-family:var(--inter-font) !important;color:rgba(0,0,0,.8);font-style:normal;font-weight:300;width:2.1660649819vw;height:2.1660649819vw;border-radius:1.4440433213vw;cursor:pointer}.containerModalBTN>button:hover{background-color:rgba(0,0,0,.09) !important}.containerModalBTN>button:nth-child(1){margin-left:0.2888086643vw}.containerModalBTN>button:nth-child(3){margin-right:0.2888086643vw}.containerModalBTN>span{font-size:1.4440433213vw !important;font-family:var(--inter-font) !important;color:rgba(0,0,0,.8);font-style:normal;font-weight:400}","",{version:3,sources:["webpack://./stories/MyButton/MyButton.scss","webpack://./stories/global.scss"],names:[],mappings:"AAEA,UACE,4BAAA,CACA,qBAAA,CACA,cAAA,CCMA,kCAAA,CACA,wCAAA,CACA,oBAVU,CAYV,iBAAA,CACA,eDTqB,CAErB,kBACE,UAAA,CACA,oBACE,UAAA,CAEF,wBACE,mCAAA,CAEF,yBACE,mCAAA,CAGJ,oBACE,mCAAA,CACA,aAAA,CACA,sBACE,aAAA,CAEF,0BACE,2CAAA,CACA,oBAAA,CACA,aAAA,CACA,4BACE,aAAA,CAGJ,2BACE,mCAAA,CACA,oBAAA,CACA,UAAA,CACA,6BACE,UAAA,CAIN,eACE,UAAA,CACA,iBACE,UAAA,CAEF,4CACE,0CAAA,CAGJ,eACE,YAAA,CACA,kBAAA,CACA,iBAAA,CACA,0CAAA,CACA,oBAAA,CACA,iBACE,oBAAA,CAEF,qBACE,2CAAA,CACA,2BAAA,CACA,oBAAA,CACA,uBACE,oBAAA,CAIJ,sBACE,2CAAA,CACA,2BAAA,CACA,oBAAA,CACA,wBACE,oBAAA,CAIJ,oBACE,iBAAA,CACA,gBAAA,CAGF,mBACE,iBAAA,CACA,oBAAA,CACA,qBAAA,CACA,mBAAA,CAGJ,eACE,qBAAA,CClFF,kCAAA,CACA,wCAAA,CACA,oBAVU,CAYV,iBAAA,CACA,eD8EuB,CACrB,4BAAA,CAGF,gBACE,oBAAA,CACA,qBAAA,CAEF,iBACE,qBAAA,CACA,qBAAA,CAEF,gBACE,oBAAA,CACA,qBAAA,CAEF,cACE,qBAAA,CACA,qBAAA,CAIJ,UACE,0CAAA,CACA,oBAAA,CACA,4BAAA,CACA,+BAAA,CACA,qBAAA,CACA,SAAA,CACA,8BAAA,CChHA,kCAAA,CACA,wCAAA,CACA,oBAVU,CAYV,iBAAA,CACA,eD4GqB,CACrB,kBAAA,CACA,cAAA,CAEA,gBACE,wBAAA,CACA,gCAAA,CAEF,iBACE,wBAAA,CACA,gCAAA,CAEF,iBACE,wBAAA,CACA,gCAAA,CAIJ,iCAEE,mBAAA,CACA,YAAA,CAGF,mBACE,qBAAA,CACA,4BAAA,CACA,YAAA,CACA,6BAAA,CACA,kBAAA,CACA,qBAAA,CACA,0CAAA,CACA,8BAAA,CAEA,0BACE,SAAA,CACA,WAAA,CACA,gCAAA,CACA,uBAAA,CCvJF,mCAAA,CACA,wCAAA,CACA,oBAVU,CAYV,iBAAA,CACA,eDmJuB,CACrB,oBAAA,CACA,qBAAA,CACA,4BAAA,CACA,cAAA,CAEA,gCACE,2CAAA,CAIJ,uCACE,0BAAA,CAGF,uCACE,2BAAA,CAGF,wBC3KA,mCAAA,CACA,wCAAA,CACA,oBAVU,CAYV,iBAAA,CACA,eDuKuB",sourcesContent:["@import '../global';\n\n.MyButton {\n  border-radius: calcSize(40);\n  border: 0px solid #fff;\n  cursor: pointer;\n\n  @include MyFonts(32, 400);\n\n  &.primary {\n    color: #fff;\n    & * {\n      color: #fff;\n    }\n    &:hover {\n      background-color: #c7172d !important;\n    }\n    &:active {\n      background-color: #b11528 !important;\n    }\n  }\n  &.secondary {\n    border: calcSize(2) solid #da1a32;\n    color: #da1a32;\n    & * {\n      color: #da1a32;\n    }\n    &:hover {\n      background-color: rgba($color: #000000, $alpha: 0.05) !important;\n      border-color: #c7172d;\n      color: #c7172d;\n      & * {\n        color: #c7172d;\n      }\n    }\n    &:active {\n      background-color: #b11528 !important;\n      border-color: #b11528;\n      color: #fff;\n      & * {\n        color: #fff;\n      }\n    }\n  }\n  &.auth {\n    color: #fff;\n    & * {\n      color: #fff;\n    }\n    &:hover, :active {\n      background-color: rgba($color: #000000, $alpha: 0.2) !important;\n    }\n  }\n  &.city {\n    display: flex;\n    align-items: center;\n    position: relative;\n    border: calcSize(3) solid rgba(0, 0, 0, 0.2);\n    color: rgba(0, 0, 0, 0.8);\n    & * {\n      color: rgba(0, 0, 0, 0.8);\n    }\n    &:hover {\n      background-color: rgba($color: #000000, $alpha: 0.05) !important;\n      border-color: rgba(0, 0, 0, 0.2);\n      color: rgba(0, 0, 0, 0.8);\n      & * {\n        color: rgba(0, 0, 0, 0.8);\n      }\n    }\n\n    &:active {\n      background-color: rgba($color: #000000, $alpha: 0.05) !important;\n      border-color: rgba(0, 0, 0, 0.2);\n      color: rgba(0, 0, 0, 0.8);\n      & * {\n        color: rgba(0, 0, 0, 0.8);\n      }\n    }\n\n    & span {\n      margin-right: auto;\n      margin-left: auto;\n    }\n\n    & svg {\n      position: absolute;\n      width: calcSize(20);\n      height: calcSize(20);\n      right: calcSize(30);\n    }\n  }\n  &.cart {\n    color: #fff !important;\n    @include MyFonts(30, 400);\n    margin-bottom: calcSize(170);\n  }\n\n  &.small {\n    width: calcSize(240);\n    height: calcSize(80);\n  }\n  &.medium {\n    width: calcSize(320);\n    height: calcSize(80);\n  }\n  &.large {\n    width: calcSize(400);\n    height: calcSize(80);\n  }\n  &.big {\n    width: calcSize(560);\n    height: calcSize(80);\n  }\n}\n\n.modalBTN {\n  border: calcSize(3) solid rgba(0, 0, 0, 0.2);\n  width: calcSize(400);\n  border-radius: calcSize(45);\n  color: rgba(0, 0, 0, 0.6) !important;\n  height: calcSize(80);\n  padding: 0;\n  background-color: transparent;\n  @include MyFonts(30, 400);\n  white-space: nowrap;\n  cursor: pointer;\n\n  &:hover {\n    background-color: #f2f2f2;\n    border: calcSize(2) solid #cccccc;\n  }\n  &:target {\n    background-color: #f2f2f2;\n    border: calcSize(2) solid #cccccc;\n  }\n  &:active {\n    background-color: #f2f2f2;\n    border: calcSize(2) solid #cccccc;\n  }\n}\n\nbutton:disabled,\nbutton[disabled]{\n  pointer-events: none;\n  cursor: unset;\n}\n\n.containerModalBTN {\n  width: calcSize(394);\n  border-radius: calcSize(45);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: calcSize(74);\n  border: calcSize(3) solid rgba(0, 0, 0, 0.2);\n  background-color: transparent;\n\n  & > button {\n    padding: 0;\n    border: none;\n    background-color: rgba(0, 0, 0, 0.07);\n    mix-blend-mode: multiply;\n    @include MyFonts(50, 300);\n    width: calcSize(60);\n    height: calcSize(60);\n    border-radius: calcSize(40);\n    cursor: pointer;\n\n    &:hover {\n      background-color: rgba(0, 0, 0, 0.09) !important;\n    }\n  }\n\n  & > button:nth-child(1) {\n    margin-left: calcSize(8);\n  }\n\n  & > button:nth-child(3) {\n    margin-right: calcSize(8);\n  }\n\n  & > span {\n    @include MyFonts(40, 400);\n  }\n}\n",'@charset "utf-8";\n\n$Roboto: var(--inter-font);\n$ColorText: rgba(0, 0, 0, 0.8);\n$ColorMain: #cc0033;\n\n@function calcSize($size) {\n  @return calc(100 * calc($size / 2770)) + vw;\n}\n\n@mixin MyFonts($size: 32, $weight: 400) {\n  font-size: calcSize($size) !important;\n  font-family: $Roboto !important;\n  color: $ColorText;\n\n  font-style: normal;\n  font-weight: $weight;\n}\n\n@mixin fonsNew($size: 1rem, $family: $Roboto) {\n  font-size: $size !important;\n  font-family: $family !important;\n  color: $ColorText;\n}\n'],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);