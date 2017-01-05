//var peoplePopModule = require('./PeoplePopModule');
//peoplePopModule.openPop({crowId: 33});
//peoplePopModule.openPop();

define(function(require,exports){
    var peoplePopModule = require('./PeoplePopModule');
    $('button').eq(0).on('click',function(){
        peoplePopModule.openPop();
    });
    $('button').eq(1).on('click',function(){
        peoplePopModule.openPop({crowId: 33});
    });
});