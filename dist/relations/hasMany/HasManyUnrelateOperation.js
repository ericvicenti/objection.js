var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var UnrelateOperation=require('../../queryBuilder/operations/UnrelateOperation');var HasManyUnrelateOperation=function(_UnrelateOperation){_inherits(HasManyUnrelateOperation,_UnrelateOperation);function HasManyUnrelateOperation(){_classCallCheck(this,HasManyUnrelateOperation);return _possibleConstructorReturn(this,(HasManyUnrelateOperation.__proto__||Object.getPrototypeOf(HasManyUnrelateOperation)).apply(this,arguments));}_createClass(HasManyUnrelateOperation,[{key:'queryExecutor',value:function queryExecutor(builder){var patch={};var ownerProp=this.relation.ownerProp;var relatedProp=this.relation.relatedProp;var ownerValues=ownerProp.getProps(this.owner);var relatedRefs=relatedProp.refs(builder);for(var i=0,l=relatedProp.size;i<l;++i){relatedProp.patch(patch,i,null);}return this.relation.relatedModelClass.query().childQueryOf(builder).patch(patch).copyFrom(builder,builder.constructor.WhereSelector).whereComposite(relatedRefs,ownerValues).modify(this.relation.modify);}}]);return HasManyUnrelateOperation;}(UnrelateOperation);module.exports=HasManyUnrelateOperation;