var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var DependencyGraph=require('./DependencyGraph');var TableInsertion=require('./TableInsertion');var promiseUtils=require('../../utils/promiseUtils');var _require=require('../../model/ValidationError'),ValidationErrorType=_require.Type;var _require2=require('../../utils/objectUtils'),uniqBy=_require2.uniqBy,isFunction=_require2.isFunction;var GraphInserter=function(){function GraphInserter(args){_classCallCheck(this,GraphInserter);this.allowedRelations=args.allowedRelations||null;this.queryContext=args.queryContext;this.modelClass=args.modelClass;this.models=args.models;this.knex=args.knex;this.opt=args.opt;this.graph=null;}_createClass(GraphInserter,[{key:'buildDependencyGraph',value:function buildDependencyGraph(){this.graph=this._buildDependencyGraph();}},{key:'checkForCyclicReferences',value:function checkForCyclicReferences(){if(this.graph.hasCyclicReferences()){throw this.modelClass.createValidationError({type:ValidationErrorType.InvalidGraph,message:'the object graph contains cyclic references'});}}},{key:'execute',value:function execute(inserter){var _this=this;return promiseUtils.try(function(){return _this._executeNormalBatches(inserter);}).then(function(){return _this._executeJoinRowBatch(inserter);}).then(function(){return _this._finalize();});}},{key:'_buildDependencyGraph',value:function _buildDependencyGraph(){var graph=new DependencyGraph(this.opt,this.allowedRelations);graph.build(this.modelClass,this.models);return graph;}},{key:'_executeNormalBatches',value:function _executeNormalBatches(inserter){return this._executeNextBatch(inserter);}},{key:'_executeNextBatch',value:function _executeNextBatch(inserter){var _this2=this;var batch=this._nextBatch();if(!batch){return null;}return this._beforeInsertBatch(batch,'executeBeforeInsert').then(function(){return promiseUtils.map(Object.keys(batch),function(tableName){var tableInsertion=batch[tableName];_this2._omitUids(tableInsertion);return inserter(tableInsertion).then(function(){return _this2._resolveDepsForInsertion(tableInsertion);});},{concurrency:_this2.modelClass.getConcurrency(_this2.knex)});}).then(function(){return _this2._executeNextBatch(inserter);});}},{key:'_nextBatch',value:function _nextBatch(){var batch=this._createBatch();if(batch){this._markBatchInserted(batch);}return batch;}},{key:'_createBatch',value:function _createBatch(){var batch=Object.create(null);var nodes=this.graph.nodes;var empty=true;for(var n=0,ln=nodes.length;n<ln;++n){var node=nodes[n];if(!node.handled&&!node.hasUnresolvedDependencies){var tableInsertion=batch[node.modelClass.getTableName()];if(!tableInsertion){tableInsertion=new TableInsertion(node.modelClass,false);batch[node.modelClass.getTableName()]=tableInsertion;}tableInsertion.items.push({model:node.model,relation:node.relation,node:node});empty=false;}}if(empty){return null;}else{return batch;}}},{key:'_beforeInsertBatch',value:function _beforeInsertBatch(batch,executorMethod){var _this3=this;var tableNames=Object.keys(batch);var modelsByRelation=new Map();for(var t=0,lt=tableNames.length;t<lt;++t){var tableName=tableNames[t];var tableInsertion=batch[tableName];for(var i=0,li=tableInsertion.items.length;i<li;++i){var item=tableInsertion.items[i];var model=item.model;var relation=item.relation;if(relation){var relModels=modelsByRelation.get(relation);if(relModels===undefined){relModels=[];modelsByRelation.set(relation,relModels);}relModels.push(model);}}}return promiseUtils.map(Array.from(modelsByRelation.keys()),function(relation){var models=modelsByRelation.get(relation);return relation[executorMethod](models,_this3.queryContext,null);},{concurrency:this.modelClass.getConcurrency(this.knex)});}},{key:'_markBatchInserted',value:function _markBatchInserted(batch){var tableNames=Object.keys(batch);for(var t=0,lt=tableNames.length;t<lt;++t){var tableInsertion=batch[tableNames[t]];var items=tableInsertion.items;for(var i=0,li=items.length;i<li;++i){items[i].node.markAsInserted();}}}},{key:'_executeJoinRowBatch',value:function _executeJoinRowBatch(inserter){var _this4=this;var batch=this._createJoinRowBatch();return this._beforeInsertBatch(batch,'executeJoinTableBeforeInsert').then(function(){return promiseUtils.map(Object.keys(batch),function(tableName){return inserter(batch[tableName]);},{concurrency:_this4.modelClass.getConcurrency(_this4.knex)});});}},{key:'_createJoinRowBatch',value:function _createJoinRowBatch(){var batch=Object.create(null);for(var n=0,ln=this.graph.nodes.length;n<ln;++n){var node=this.graph.nodes[n];for(var m=0,lm=node.manyToManyConnections.length;m<lm;++m){var conn=node.manyToManyConnections[m];var tableInsertion=batch[conn.relation.joinTable];var ownerProp=conn.relation.ownerProp.getProps(node.model);var modelClass=conn.relation.getJoinModelClass(this.knex);var joinModel=conn.relation.createJoinModels(ownerProp,[conn.node.model])[0];if(conn.refNode){for(var k=0,lk=conn.relation.joinTableExtras.length;k<lk;++k){var extra=conn.relation.joinTableExtras[k];if(conn.refNode.model[extra.aliasProp]!==undefined){joinModel[extra.joinTableProp]=conn.refNode.model[extra.aliasProp];}}}joinModel=modelClass.fromJson(joinModel);if(!tableInsertion){tableInsertion=new TableInsertion(modelClass,true);batch[modelClass.getTableName()]=tableInsertion;}tableInsertion.items.push({model:joinModel,relation:conn.relation,node:conn.node});}}return this._removeJoinRowDuplicatesFromBatch(batch);}},{key:'_removeJoinRowDuplicatesFromBatch',value:function _removeJoinRowDuplicatesFromBatch(batch){var tableNames=Object.keys(batch);for(var t=0,lt=tableNames.length;t<lt;++t){var tableName=tableNames[t];var tableInsertion=batch[tableName];if(tableInsertion.items.length){(function(){var items=tableInsertion.items;var keySet=new Set();var keys=[];for(var i=0,li=items.length;i<li;++i){var item=items[i];var model=item.model;var modelKeys=Object.keys(model);for(var k=0,lk=modelKeys.length;k<lk;++k){var key=modelKeys[k];if(!keySet.has(key)){keySet.add(modelKeys[k]);keys.push(key);}}}tableInsertion.items=uniqBy(items,function(item){return item.model.$propKey(keys);});})();}}return batch;}},{key:'_omitUids',value:function _omitUids(tableInsertion){var modelClass=tableInsertion.modelClass;var uidProp=modelClass.uidProp;for(var i=0,li=tableInsertion.items.length;i<li;++i){var item=tableInsertion.items[i];var model=item.model;modelClass.omitImpl(model,uidProp);}}},{key:'_resolveDepsForInsertion',value:function _resolveDepsForInsertion(tableInsertion){for(var i=0,li=tableInsertion.items.length;i<li;++i){var node=tableInsertion.items[i].node;var model=tableInsertion.items[i].model;for(var d=0,ld=node.isNeededBy.length;d<ld;++d){node.isNeededBy[d].resolve(model);}}}},{key:'_finalize',value:function _finalize(){for(var n=0,ln=this.graph.nodes.length;n<ln;++n){var refNode=this.graph.nodes[n];var modelClass=refNode.modelClass;var ref=refNode.model[modelClass.uidRefProp];if(ref){var actualNode=this.graph.nodesById.get(ref);var relations=actualNode.modelClass.getRelations();var keys=Object.keys(actualNode.model);for(var i=0,l=keys.length;i<l;++i){var key=keys[i];var value=actualNode.model[key];if(!relations[key]&&!isFunction(value)){refNode.model[key]=value;}}modelClass.omitImpl(refNode.model,modelClass.uidProp);modelClass.omitImpl(refNode.model,modelClass.uidRefProp);modelClass.omitImpl(refNode.model,modelClass.dbRefProp);}else if(refNode.model[modelClass.uidProp]){modelClass.omitImpl(refNode.model,modelClass.uidProp);modelClass.omitImpl(refNode.model,modelClass.dbRefProp);}}return Promise.resolve(this.models);}}]);return GraphInserter;}();module.exports=GraphInserter;