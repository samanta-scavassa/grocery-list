var app = angular.module('groceryListApp', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/groceryList.html",
            controller: "GroceryListItemsController"
        })
        .when("/addItem", {
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemsController"
        })
        .when("/addItem/:id", {
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemsController"
        })
        .when("/addItem/edit/:id", {
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemsController"
        })
        .otherwise({
            redirectTo: "/"
        })
})



app.service("GroceryService", function () {
    var groceryService = {};

    groceryService.groceryItems = [
        {id: 1, completed: true, itemName: 'milk', date: '2014-10-01'},
        {id: 2, completed: true, itemName: 'cookies', date: '2014-10-01'},
        {id: 3, completed: true, itemName: 'ice cream', date: '2014-10-02'},
        {id: 4, completed: true, itemName: 'potatoes', date: '2014-10-02'},
        {id: 5, completed: true, itemName: 'cereal', date: '2014-10-03'},
        {id: 6, completed: true, itemName: 'bread', date: '2014-10-03'},
        {id: 7, completed: true, itemName: 'egg', date: '2014-10-04'},
        {id: 8, completed: true, itemName: 'tortillas', date: '2014-10-04'}
    ];

    groceryService.findById = function (id) {
        for (var item in groceryService.groceryItems) {
            if (groceryService.groceryItems[item].id === id) {
                console.log(groceryService.groceryItems[item]);
                return groceryService.groceryItems[item];
            }
        }
    }


    groceryService.getNewId = function () {
        if (groceryService.newId) {
            groceryService.newId++;
            return groceryService.newId;
        } else {
            var maxId = _.max(groceryService.groceryItems, function (entry) {
                return entry.id;
            })
            groceryService.newId = maxId.id + 1;
            return groceryService.newId;
        }

    }

    groceryService.save = function (entry) {
        var updatedItem = groceryService.findById(entry.id);

        if(updatedItem){
            updatedItem.completed = entry.completed;
            updatedItem.itemName = entry.itemName;
            updatedItem.date = entry.date;
        }else {
            entry.id = groceryService.getNewId();
            groceryService.groceryItems.push(entry);
        }
    };

    return groceryService;
});

app.controller("HomeController", ["$scope", "GroceryService", function ($scope, GroceryService) {
    $scope.appTitle = "Grocery List";
    $scope.groceryItems = GroceryService.groceryItems;
}]);

app.controller("GroceryListItemsController", ["$scope", "$routeParams", "$location", "GroceryService", function ($scope, $routeParams, $location, GroceryService) {
    $scope.groceryItems = GroceryService.groceryItems;

    $scope.rp = "Route parameter value:" + $routeParams.id;

    if (!$routeParams.id) {
        $scope.groceryItem = {id: 0, completed: true, itemName: "", date: new Date()};
    } else {
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
    }


    $scope.save = function () {
        GroceryService.save($scope.groceryItem);
        $location.path("/");
    }

    console.log($scope.groceryItems);
}]);