/**
 * Created by Martin on 2016/6/27.
 */
angular.module('inspinia', [])
    .controller('roleMgrCtrl', roleMgrCtrl);

/**
 * roleCtrl - controller
 */
roleMgrCtrl.$inject = ['$scope', 'Constants'];

function roleMgrCtrl($scope, Constants) {
    var mgrOpts = {
        fields: [
            {
                'key': 'roleName',
                'type': 'input',
                'templateOptions': {'label': '角色名', required: true, 'placeholder': '角色名'}
            },
            {'key': 'description', 'type': 'input', 'templateOptions': {'label': '描述', 'placeholder': '描述'}}
        ],
        api: {
            read: '/admin/roles/paging',
            update: '/admin/roles/save'
        }
    };

    Constants.initNgMgrCtrl(mgrOpts, $scope);
}