'use strict';

describe('$js', function() {

    var uid = 0;

    it('should generate a unique number',function() {
        var uid = $js.nextID();
        var nextid = $js.nextID();
        expect(uid).not.toBe(nextid);
    });

});
