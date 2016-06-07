/**
 * Created by Martin on 2016/4/12.
 */
function constServiceCtor($filter, $compile, $resource, $state) {
    var vm = this;

    vm.sizeFormatter = function (value, opts, row) {
        if (!row.leaf || 0 == value) {
            return '-';
        }
        if (value > 1024 * 1024 * 1024) {
            return Math.ceil(value / (1024 * 1024 * 1024)) + 'G';
        }
        if (value > 1024 * 1024) {
            return Math.ceil(value / (1024 * 1024)) + 'M';
        }
        if (value > 1024) {
            return Math.ceil(value / 1024) + 'K';
        }
        return value + 'B';
    };

    vm.dateFormatter = function (value, opts, row) {
        if (value) {
            return $filter('date')(new Date(value), 'yyyy-MM-dd HH:mm:ss');
        }
        return '-';
    };

    vm.defaultOptions = {
        info: true,
        searching: false,
        lengthChange: false,
        serverSide: true,
        pagingType: "simple_numbers",
        pageLength: 10,
        deferLoading: 0,
        dom: 'Brtip',
        buttons: [
            {extend: 'csv', text: '导出CSV'}
        ],
        statusCode: {
            302: function () {
                $state.go('/');
            }
        },
        language: {
            info: "显示 _START_ - _END_条，共 _TOTAL_ 条",
            infoEmpty: "显示 0 - 0条，共 0 条",
            emptyTable: "没有查找到数据",
            loadingRecords: "加载中...",
            processing: "处理中...",
            zeroRecords: "没找到匹配的记录",
            paginate: {
                first: "第一页",
                last: "最后页",
                next: "下一页>",
                previous: "<上一页"
            },
            aria: {
                sortAscending: ": 升序",
                sortDescending: ": 降序"
            }
        }
    };

    vm.compile4Row = function (row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    };

    vm.buildOption = function (url, bindWhere, compile4Row) {
        return angular.extend(
            {
                ajax: {
                    url: url,
                    dataSrc: "rows",
                    data: bindWhere
                },
                createdRow: compile4Row
            }, vm.defaultOptions);
    };

    //从后台拿店铺类型
    vm.merchantType = [];
    $resource('/admin/merchant/typeList').get({}, function (resp) {
        angular.forEach(resp.rows[0], function (key, value) {
            var type = {name: key, value: value};
            vm.merchantType.push(type);
        });
    });

    //从后台拿商户列表
    vm.merchants = [];
    $resource('/admin/merchant/list').get({}, function (resp) {
        //console.log(resp.rows)
        angular.forEach(resp.rows, function (merchant) {
            var option = {name: merchant.name, value: merchant.id};
            //console.log(option);
            vm.merchants.push(option);
        });
    });

    vm.thisMerchant = {};
    $resource('/admin/merchant/getSwitch').get({}, function (resp) {
        //console.log(resp.rows);
        if (resp.rows.length == 0) {
            vm.thisMerchant = {};
        }
        else {
            //console.log("#####merchantsLength:"+vm.merchants.length);
            vm.flushThisMerchant(resp.rows[0].id);//按F5刷新后，vm.merchants为[],导致匹配不成功？？？？？？？？？？？？？？？
        }
        //console.log(vm.thisMerchant)
    });
    vm.flushThisMerchant = function (value) {
        var length = vm.merchants.length;
        for (var i = 0; i < length; i++) {
            if (vm.merchants[i].value == value) {
                break;
            }
        }
        vm.thisMerchant = vm.merchants[i];
        //console.log(vm.thisMerchant);
    }

    //从后台拿到省列表
    vm.provinces = [];
    $resource('/admin/province/list').get({}, function (resp) {
        var length = resp.rows.length;
        if (length > 0) {
            for (var j = 0; j < length; j++) {
                vm.provinces.push({name: resp.rows[j].name, value: resp.rows[j].id});
            }
        }
        console.log("provincesLength:" + vm.provinces.length);
    });

    //根据省从后台拿市列表
    vm.citys = [];
    vm.getCitysByProvince = function (provinceId) {
        $resource('/admin/city/listByProvince').get({id: provinceId}, function (resp) {
            var length = resp.rows.length;
            if (length > 0) {
                for (var j = 0; j < length; j++) {
                    vm.citys.push({name: resp.rows[j].name, value: resp.rows[j].id});
                }
            }
            console.log("citysLength:" + vm.citys.length);
        });
    }

    //根据省从后台拿市列表
    vm.districts = [];
    vm.getDistrictsByCity = function (cityId) {
        $resource('/admin/district/listByCity').get({id: cityId}, function (resp) {
            var length = resp.rows.length;
            if (length > 0) {
                for (var j = 0; j < length; j++) {
                    vm.districts.push({name: resp.rows[j].name, value: resp.rows[j].id});
                }
            }
            console.log("districtsLength:" + vm.districts.length);
        });
    }

    vm.initMgrCtrl = function (mgrData, scope) {
        $.fn.dataTable.ext.errMode = 'none';

        scope.where = {};

        scope.formData = {
            fields: mgrData.fields
        };
        scope.showDataTable = true;
        scope.showEditor = false;

        scope.goDataTable = function () {
            scope.showDataTable = true;
            scope.showEditor = false;
        };

        scope.goEditor = function (rowIndex) {
            var api = this.dtInstance;
            if (api) {
                scope.dtApi = api;
            }
            scope.addNew = true;
            if (scope.dtApi && rowIndex > -1) {
                var data = scope.dtApi.DataTable.row(rowIndex).data();
                scope.formData.model = data;
                scope.addNew = false;
                scope.rowIndex = rowIndex;
            } else {
                scope.formData.model = {}
            }
            scope.showDataTable = false;
            scope.showEditor = true;
        };

        scope.doDelete = function (rowIndex) {
            var api = this.dtInstance;
            if (api) {
                scope.dtApi = api;
            }
            scope.addNew = true;
            if (scope.dtApi && mgrData.api.delete && rowIndex > -1) {
                var data = scope.dtApi.DataTable.row(rowIndex).data();
                $resource(mgrData.api.delete).save({}, data, saveSuccess, saveFailed);
            }
        };

        scope.dtInstance = null;
        scope.dtColumns = mgrData.columns;
        scope.dtOptions = vm.buildOption(mgrData.api.read, function (data) {
            angular.extend(data, scope.where);
        }, function (row, data, dataIndex) {
            var content = angular.element(row).contents();
            $compile(content)(scope);
        });

        function saveSuccess(response) {
            if (0 != response.status) {
                return;
            }
            var data = scope.formData.model;
            if (!scope.addNew) {
                scope.dtApi.DataTable.row(scope.rowIndex).remove();
            }
            scope.dtApi.DataTable.rows.add(data).draw(false);
            scope.goDataTable();
        }

        function saveFailed(response) {
            console.log(response);
        }

        scope.processSubmit = function () {
            var formly = scope.formData;
            if (formly.form.$valid) {
                formly.options.updateInitialValue();
                $resource(mgrData.api.update).save({}, formly.model, saveSuccess, saveFailed);
            }
        };

        scope.search = function () {
            var api = this.dtInstance;
            if (api) {
                scope.dtApi = api;
                api.reloadData();
            }
        };

    };
}

angular
    .module('inspinia')
    .service('Constants', constServiceCtor);