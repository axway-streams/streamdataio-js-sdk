
describe('Listeners.', function() {

    describe('CheckParams', function() {
        it("cannot create new instance if params are not provided", function() {
            // GIVEN

            // EXPECT
            expect(function(){
                new Listeners();
            }).toThrow();
        });

        it("can create a new instance", function() {
            // GIVEN
            var bind = {};

            // EXPECT
            expect(function(){
                new Listeners(bind);
            }).not.toThrow();
        });
    });
  
    describe('AddAndRemoveListeners', function() {
        it("can add a new listener", function() {
            // GIVEN
            var bind = {};
            var listener = function() {};

            // EXPECT
            expect(function(){
                var listeners = new Listeners(bind);
                listeners.add(listener);
            }).not.toThrow();
        });

        it("can remove a new listener", function() {
            // GIVEN
            var bind = {};
            var listener = function() {};

            // EXPECT
            expect(function() {
                var listeners = new Listeners(bind);
                listeners.add(listener);
                listeners.remove(listener);
            }).not.toThrow();
        });

        it("cannot add a listener if already exists", function() {
            // GIVEN
            var bind = {};
            var listener = function() {};

            var listeners = new Listeners(bind);
            listeners.add(listener);

            expect(function(){
                listeners.add(listener);
            }).toThrow();


        });

        it("cannot remove a listener if not exists", function() {
            // GIVEN
            var bind = {};
            var listener = function() {};

            // EXPECT
            expect(function(){
                var listeners = new Listeners(bind);
                listeners.remove(listener);
            }).toThrow();
        });

    });
  

    describe('FireListeners', function() {
        beforeEach(function() {
            listener1 = jasmine.createSpy('listener1');
            listener2 = jasmine.createSpy('listener2');
            listener3 = jasmine.createSpy('listener3');

        });

        it("can fire to the listeners", function() {

            // GIVEN
            var bind = {};
            var param1 = {};
            var param2 = {};
            var param3 = {};

            var listeners = new Listeners(bind);
            listeners.add(listener1);
            listeners.add(listener2);
            listeners.add(listener3);

            //EXPECT
            expect(function(){
                listeners.fire(param1, param2, param3);
            }).not.toThrow();

            expect(listener1).toHaveBeenCalled();
            expect(listener2).toHaveBeenCalled();
            expect(listener3).toHaveBeenCalled();

        });
    });
});
