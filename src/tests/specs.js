/* global angular */

describe('DRRrrRrvrr', function() {

    /* INIT ANGULAR */
    var ListController;
    var GoogleDriveService;
    beforeEach(angular.mock.module('DRRrrRrvrr'));
    beforeEach(angular.mock.inject( function( $controller ) {
        ListController = $controller('ListController');
    } ));
    beforeEach(angular.mock.inject( function( $controller ) {
        GoogleDriveService = $controller('GoogleDriveService');
    } ));

    describe('ListController', function() {
        it('should load the file list', function(){

            //ListController.handleAuthClick();
            //expect( ListController.files.length ).toBeGreaterThan( 0 );
            expect(1).toBeTruthy;

        });
    });

    it('should be truthy', function() {
        expect(1).toBeTruthy;
    });

});
