var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var InternalOptions=require('./InternalOptions');var QueryBuilderContextBase=function(){function QueryBuilderContextBase(builder){_classCallCheck(this,QueryBuilderContextBase);this.userContext=builder?new builder.constructor.QueryBuilderUserContext(builder):null;this.options=builder?new this.constructor.InternalOptions():null;this.knex=null;this.aliasMap=null;this.tableMap=null;}_createClass(QueryBuilderContextBase,[{key:'clone',value:function clone(){var ctx=new this.constructor();ctx.userContext=this.userContext;ctx.options=this.options.clone();ctx.knex=this.knex;ctx.aliasMap=this.aliasMap;ctx.tableMap=this.tableMap;return ctx;}}],[{key:'InternalOptions',get:function get(){return InternalOptions;}}]);return QueryBuilderContextBase;}();module.exports=QueryBuilderContextBase;