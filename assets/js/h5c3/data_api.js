/*
 data_api.js

 provides a data layer that abstracts out the getting and setting of records
 provides a local proxy cache and a transaction cache
 http://stackoverflow.com/questions/6823669/javascript-library-pattern
 http://upstatement.com/blog/2012/01/jquery-local-storage-done-right-and-easy/

 Note:
    recordIndex - represents an index kept by the browser app of all records
    recordKey - the key used to store the record in local storage. format: record.{batchId}.{recordIndex}
    recordGuid - id of the record as it is known on the server

  */



// object for storing a record and flags
var dataApi = {

    // private variables
    // =================
    m_dataUrl:                  "",
    m_batchId:                  "",

    m_recordCount:              0,
    m_tosendCount:              0,

    m_proxyCacheCallback:       null,
    m_sendCacheCallback:        null,

    m_onLine:                   false,
    m_sendQueue:                null,

    m_processingSendCache:      false,

    // public methods
    // ==============

    init:
        function(dataUrl,batchId,proxyCacheCallback,sendCacheCallback) {
            this.m_dataUrl = dataUrl;
            this.m_batchId = batchId;
            this.m_proxyCacheCallback = proxyCacheCallback;
            this.m_sendCacheCallback =  sendCacheCallback;

            // update counts with records in local storage
            var records = this.listRecords();

            // spin thru and queue up the records for this batch that need to be sent
            for(var i=0;i<records.length;i++){
                this.m_recordCount++;
                var rec = records[i];
                // get the sent fields
                var sent = records[i].getSent();
                // if it hasn't been sent, then add it to the queue
                if(!sent){
                    this.m_addToSendQueue(rec.getRecordKey());
                }
            }

            // set the counts
            this.m_tosendCount = (this.m_sendQueue!=null)?this.m_sendQueue.length:0;
            this.m_proxyCacheCallback(this.m_recordCount);
            this.m_sendCacheCallback(this.m_tosendCount);
        },



    setOnline:
        function(trueOrFalse) {
            this.m_onLine = trueOrFalse;

            if(trueOrFalse){
                // process the queue
                this.m_sendNextRecord();
            }
        },

    getRecordCount:
        function() {
            return this.m_recordCount;
        },

    getRecord:
        function(index) {
            // the stored record was streamed out as json
            // we need to create a new Record and populate it with the json values coming out.
            var record = new Record();
            var data = $.totalStorage.getItem(this.m_createRecordKey(index));
            if(data != null){
                record.setFields(data.fields);
            }
            return record;
        },

    addRecord:
        function(record) {
            var recordKey = this.m_createRecordKey(++this.m_recordCount);
            record.setDeleted(false);
            record.setSent(false);
            record.setRecordKey(recordKey);
            $.totalStorage.setItem(recordKey,record);
            this.m_proxyCacheCallback(this.m_recordCount);

            // add to the send queue to send to server
            this.m_addToSendQueue(recordKey);
            return this.m_recordCount;
        },

    updateRecord:
        function(index,record) {
            $.totalStorage.setItem(this.m_createRecordKey(index),record);
            this.m_addToSendQueue(this.m_createRecordKey(index));
        },

    removeRecord:
        function(index) {
            alert("inside removeRecord "+index);
        },

    listRecords:
        function() {
            var records = new Array();
            var recs = $.totalStorage.getAll();
            // spin thru local storage and get a list of records in this batch
            for(var i=0;i<recs.length;i++){
                var keyPrefix = this.m_createRecordKey();
                var key = recs[i].key;
                if(key.indexOf(keyPrefix) == 0){
                    var rec = this.m_getRecordWithRecordKey(key);
                    records.push(rec);
                }
            }

            return records;
        },

    clearRecords:
        function() {
            $.totalStorage.clearAll();
            this.m_recordCount = 0;
            this.m_sendQueue = null;
            this.m_tosendCount = 0;
            this.m_proxyCacheCallback(this.m_recordCount);
            this.m_sendCacheCallback(this.m_tosendCount);

        },


    // private methods
    // ===============

    m_getRecordWithRecordKey:
        function(recordKey) {
            // the stored record was streamed out as json
            // we need to create a new Record and populate it with the json values coming out.
            var record = new Record();
            var data = $.totalStorage.getItem(recordKey);
            if(data != null){
                record.setFields(data.fields);
            }else{
                alert("failed to get the record: "+this.m_createRecordKey(index));
            }
            return record;
        },

    m_setRecordWithRecordKey:
        function(recordKey,record) {
            $.totalStorage.setItem(recordKey,record);
        },

    m_addToSendQueue:
        function(recordKey) {
            if(this.m_sendQueue == null){
                this.m_sendQueue = new Array();
            }
            this.m_sendQueue.push(recordKey);
            this.m_sendCacheCallback(this.m_sendQueue.length);

            // process the queue
            if(this.m_processingSendCache == false){
                this.m_sendNextRecord();
            }
        },

    m_sendNextRecord:
        function() {
            // if we are online
            if( this.m_sendQueue != null && this.m_sendQueue.length > 0 && this.m_onLine ) {
                this.m_processingSendCache = true;
                var recordKey = this.m_sendQueue[0];

                // get the record
                var rec = this.m_getRecordWithRecordKey(recordKey);
                var fields = rec.getFields();
                var postFields = rec.getFieldsForPost();
                var stringFields = JSON.stringify(fields);
                //var postFields = JSON.parse(fields);

                $.ajax({
                    type: "POST",
                    url: this.m_dataUrl+"?batchId="+this.m_batchId+"&recordKey="+recordKey,
                    data: postFields,
                    success: function (data) {
                        if(data.status == "success"){
                            dataApi.m_processSentRecord(data.recordKey, data.recordGuid);
                        }else{
                            alert("failed to send");
                        }
                    }
                    ,
                    error: function(xhr, status, error) {
                        m_processingSendCache = false;
                        //alert("oops; Could not save the record.\nError="+error);
                    }
                });
            }else{
                this.m_processingSendCache = false;
            }

        },

    m_processSentRecord:
        function(recordKey, recordGuid) {

            // get the sent record
            var rec = this.m_getRecordWithRecordKey(recordKey);

            // set the record to sent
            rec.setSent(true);
            rec.setRecordGuid(recordGuid);
            this.m_setRecordWithRecordKey(recordKey,rec); //

            // remove it from the send queue
            this.m_sendQueue.shift();

            // indicate that it was sent successfully
            this.m_sendCacheCallback(this.m_sendQueue.length);

            // loop calling m_sendNextRecord while our queue has records
            this.m_sendNextRecord();
        },

    m_createRecordKey:
        function(index){
          if(index == undefined) {
              index = "";
          }
          return "record."+this.m_batchId+"."+index;
    }
}



// object for storing a record and flags
function Record(){
    var fields = null;
}

Record.prototype = {

    // id in the browser
    setRecordKey:
        function(recordKey) {
            this.setField("recordKey",recordKey);
        },
    getRecordKey:
        function() {
            return this.getField("recordKey");
        },
    // id on the server
    setRecordGuid:
        function(recordGuid) {
            this.setField("recordGuid",recordGuid);
        },
    getRecordGuid:
        function() {
            return this.getField("recordGuid");
            //return this.id;
        },
    setDeleted:
        function(trueOrFalse) {
            this.setField("deleted",trueOrFalse);
            //this.deleted = trueOrFalse;
        },
    getDeleted:
        function() {
            return this.getField("deleted");
            //this.deleted = trueOrFalse;
        },
    setSent:
        function(trueOrFalse) {
            this.setField("sent",trueOrFalse);
        },
    getSent:
        function() {
            return this.getField("sent");
        },
    addField:
        function(name,value) {
            if(this.fields == null){
                this.fields = new Array();
            }
            this.fields.push({fieldName:name, fieldValue:value});
            var count = 1;
        },
    getField:
        function(name) {
            if(this.fields != null){
                // spin thru the fields
                for(i=0;i<this.fields.length;i++){
                    if(this.fields[i].fieldName == name){
                        return this.fields[i].fieldValue;
                    }
                }
            }
            return "";
        },
    setField:
        function(name,value) {
            var found = false;
            if(this.fields != null){
                // spin thru the fields
                for(i=0;i<this.fields.length;i++){
                    if(this.fields[i].fieldName == name){
                        this.fields[i].fieldValue = value;
                        found = true;
                        break;
                    }
                }
            }
            if( !found ){
                this.addField(name,value);
            }
        },
    clearFields:
        function() {
            if(this.fields != null){
                this.fields = null;
            }
        },
    setFields:
        function(fields) {
            this.fields = fields;
        },
    getFields:
        function() {
            return this.fields;
        },
    getFieldsForPost:
        function() {
            var postStr = "";
            if( this.fields != null ){
                for(i=0;i<this.fields.length;i++){
                    if(i>0){
                        postStr += '&';
                    }
                    postStr += this.fields[i].fieldName +'=';
                    postStr += this.fields[i].fieldValue;
                }
            }
            return postStr;
        }

}





//(function () {
//    DataApi = function (dataUrl,batchId,proxyCacheCallback,sendCacheCallback) {
//        this.setDataUrl(dataUrl);
//        this.setBatchId(batchId);
//
//        this.setProxyCacheCallback(proxyCacheCallback);
//        this.setsendCacheCallback(sendCacheCallback);
//
//    };
//
//    // private methods and variables
//    // =============================
//    DataApi.prototype.dataUrl = "";
//    DataApi.prototype.batchId = "";
//
//    DataApi.prototype.recordCount = 0;
//    DataApi.prototype.tosendCount = 0;
//
//    DataApi.prototype.proxyCacheCallback = null;
//    DataApi.prototype.sendCacheCallback = null;
//
//    DataApi.prototype.onLine = false;
//
//
//    // public methods
//    // ==============
//
//    DataApi.prototype.setDataUrl = function (dataUrl) {
//        this.dataUrl = dataUrl;
//    };
//
//    DataApi.prototype.setBatchId = function (batchId) {
//        this.batchId = batchId;
//    };
//
//    DataApi.prototype.setProxyCacheCallback = function (proxyCacheCallback) {
//        this.proxyCacheCallback = proxyCacheCallback;
//    };
//
//    DataApi.prototype.setsendCacheCallback = function (sendCacheCallback) {
//        this.sendCacheCallback = sendCacheCallback;
//    };
//
//    // set the on/off line modes
//    DataApi.prototype.setOnline = function(trueOrFalse){
//        DataApi.prototype.onLine = trueOrFalse;
//    }
//
//    // get a record identified by id
//    DataApi.prototype.getRecord = function(id){
//        // the stored record was streamed out as json
//        // we need to create a new Record and populate it with the json values coming out.
//        var record = new Record();
//        var data = $.totalStorage(id);
//        record.setFields(data.fields);
//        record.setId(data.id);
//        record.setDeleted(data.deleted);
//        record.setsendted(data.sendted);
//        return record;
//    }
//
//    // set a record. adds if it doesn't exist or updates an existing record
//    // totalStorage will serialize the record out as JSON
//    DataApi.prototype.addRecord = function(record){
//        var recId = this.batchId+":"+(++this.recordCount);
//        record.setId(recId);
//        record.setDeleted(false);
//        record.setsendted(false);
//        $.totalStorage(recId,record);
//        this.proxyCacheCallback(this.recordCount);
//        this.sendCacheCallback(++this.tosendCount);
//
//        this.sendRecord(recId);
//
//    }
//
//    // set a record. adds if it doesn't exist or updates an existing record
//    // totalStorage will serialize the record out as JSON
//    DataApi.prototype.setRecord = function(id,record){
//        $.totalStorage(id,record);
//    }
//
//    DataApi.prototype.removeRecord = function(id){
//        alert("inside removeRecord "+id);
//    }
//
//    DataApi.prototype.listRecords = function(){
//        $.totalStorage.getAll();
//    }
//
//    DataApi.prototype.clearRecords = function(){
//        $.totalStorage.clearAll();
//        this.recordCount = 0;
//        this.tosendCount = 0;
//        this.proxyCacheCallback(this.recordCount);
//        this.sendCacheCallback(this.tosendCount);
//    }
//
//    DataApi.prototype.sendRecord = function(id){
//        // get the record
//        var rec = this.getRecord(id);
//
//        $.ajax({
//            type: "POST",
//            url: this.dataUrl,
//            data: rec.getFields,
//            success: function (data) {
//                // indicate that it was sendted successfully
//                // this.sendCacheCallback(--this.tosendCount);
//                // get the returned id and set the record to sendted
//                // rec.setsendted(true);
//            }
//            ,
//            error: function(xhr, status, error) {
//                alert("oops; Could not save the record.\nError="+error);
//            }
//        });
//
//    }
//
//
//}());




//var Record = {
//    id:             0,
//    fields:         null,
//    sendted:    false,
//    deleted:        false,
//
//    init:
//        function(id) {
//            this.id = id;
//        },
//    setDeleted:
//        function(trueOrFalse) {
//            this.deleted = trueOrFalse;
//        },
//    setsendted:
//        function(trueOrFalse) {
//            this.sendted = trueOrFalse;
//        },
//    addField:
//        function(name,value) {
//            if(fields == null){
//                fields = new Array();
//            }
//            fields.push({'fieldName':name,'fieldValue':value})
//        },
//    getField:
//        function(name) {
//            if(fields != null){
//                // spin thru the fields
//                for(i=0;i<fields.length;i++){
//                    if(fields[i].fieldName == name){
//                        return fields[i].fieldValue;
//                    }
//                }
//            }
//            return "";
//        },
//    setField:
//        function(name,value) {
//            var found = false;
//            if(fields != null){
//                // spin thru the fields
//                for(i=0;i<fields.length;i++){
//                    if(fields[i].fieldName == name){
//                        fields[i].fieldValue = value;
//                    }
//                }
//            }
//            if( !found ){
//                this.addField(name,value);
//            }
//        },
//    clearFields:
//        function() {
//            if(fields != null){
//                fields = null;
//            }
//        },
//    setFields:
//        function(id,fields) {
//            this.data = fields;
//        },
//    getFields:
//        function() {
//            return this.fields;
//        }
//
//}



//(function() {
//    //When we create variables inside a function they can only be seen by other
//    // inner functions. Wraping all our code here makes sure noone gets to see
//    // the private stuff.
//
//    //The first opening parenthesis is required for Javascript to parse it
//
//    //this is the constructor function
//    //Note how we set a global variable (DataApi) to make it available outside.
//    DataApi = function(url) {
//        this.changeUrl(url);
//
//        //sometimes you will want to make a method that modifies a variable
//        //that can't be acessed via this.xxx. You can use a closure here for that
//        //(there are some performance considerations though)
//
////        this.sample = function(){
////            console.log(url);
////        }
//
//        //Setting methods "by hand" like this is also useful if you want to
//        //do multiple inheritance, since you can just set all methods of the
//        //second class by hand here if you want.
//    }
//
//    //Things on Foo.prototype will be available for all Foo objects,
//    // via prototypal inheritance magic.
//    DataApi.prototype.changeurl = function(url) {
//        this.url = url;
//    }
//
//    var a_sample_variable = 42;
//
//
//    // private functions
//    // =================
//    function my_private_function(){
//        console.log(a_sample_variable);
//    }
//
//
//    // public methods
//    // ==============
//
//    // set the on/off line modes
//    Foo.prototype.setMode = function(){
//        alert("inside");
//    }
//
//    Foo.getRecord = function(){
//        alert("inside");
//    }
//
//    Foo.prototype.setRecord = function(){
//
//    }
//
//    Foo.prototype.removeRecord = function(){
//
//    }
//
//}());
//
