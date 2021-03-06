/**
 * Created by Martin on 2016/6/27.
 */
angular.module('inspinia', [])
    .controller('tableTypeMgrCtrl', tableTypeMgrCtrl);

/**
 * roleCtrl - controller
 */
tableTypeMgrCtrl.$inject = ['$scope', 'Constants'];

function tableTypeMgrCtrl($scope, Constants) {
    var mgrData = {
        fields: [
            {'key': 'name', 'type': 'input', 'templateOptions': {'label': '名称', required: true, 'placeholder': '名称'}},
            {
                'key': 'description',
                'type': 'input',
                'templateOptions': {'label': '描述', required: true, 'placeholder': '描述'}
            },
            {'key': 'capacity', 'type': 'input', 'templateOptions': {'label': '容纳人数', 'placeholder': '容纳人数'}},
            {
                'key': 'minimum',
                'type': 'input',
                'templateOptions': {'label': '最小就坐', required: true, 'placeholder': '最小就坐'}
            }
        ],
        api: {
            read: '/admin/catering/type/paging',
            update: '/admin/catering/type/save'
        }
    };

    Constants.initNgMgrCtrl(mgrData, $scope)
}