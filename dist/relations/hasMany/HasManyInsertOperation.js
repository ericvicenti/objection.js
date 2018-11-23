var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined;}else{return get(parent,property,receiver);}}else if("value"in desc){return desc.value;}else{var getter=desc.get;if(getter===undefined){return undefined;}return getter.call(receiver);}};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var RelationInsertOperation=require('../RelationInsertOperation');var _require=require('../../utils/promiseUtils'),after=_require.after;var HasManyInsertOperation=function(_RelationInsertOperat){_inherits(HasManyInsertOperation,_RelationInsertOperat);function HasManyInsertOperation(){_classCallCheck(this,HasManyInsertOperation);return _possibleConstructorReturn(this,(HasManyInsertOperation.__proto__||Object.getPrototypeOf(HasManyInsertOperation)).apply(this,arguments));}_createClass(HasManyInsertOperation,[{key:'onAdd',value:function onAdd(builder,args){var retVal=_get(HasManyInsertOperation.prototype.__proto__||Object.getPrototypeOf(HasManyInsertOperation.prototype),'onAdd',this).call(this,builder,args);var ownerProp=this.relation.ownerProp;var relatedProp=this.relation.relatedProp;for(var i=0,lm=this.models.length;i<lm;++i){var model=this.models[i];for(var j=0,lp=relatedProp.size;j<lp;++j){relatedProp.setProp(model,j,ownerProp.getProp(this.owner,j));}}return retVal;}},{key:'onAfter1',value:function onAfter1(builder,ret){var _this2=this;var maybePromise=_get(HasManyInsertOperation.prototype.__proto__||Object.getPrototypeOf(HasManyInsertOperation.prototype),'onAfter1',this).call(this,builder,ret);if(!this.assignResultToOwner){return maybePromise;}return after(maybePromise,function(inserted){_this2.owner.$appendRelated(_this2.relation,inserted);return inserted;});}}]);return HasManyInsertOperation;}(RelationInsertOperation);module.exports=HasManyInsertOperation;