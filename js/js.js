
(function() {
    var module = angular.module('adam', []);

    function minesweeper() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                rowNr: "=",
                colNr: "=",
                bombs: "="
            },
            link: mineLink,
            templateUrl: '../template/game.tpl.html'
        }
    }

    function mineLink(scope) {
        var bombArray = getRandomNumbersInRange(scope.rowNr * scope.colNr, scope.bombs);

        scope.model = [],
        fillArrayWithObjects(scope.model, scope.rowNr, scope.colNr, bombArray);
        findBombs(scope.model, scope.rowNr, scope.colNr);

        console.log(bombArray);
        console.log(scope.model);

        scope.clickHandler = function(i, j) {
            var elem = scope.model[i][j];

            if (elem.bomb) {
                alert('HELLO BOMBA');
            } else {
                elem.show = true;
                if (elem.neighbourCnt === 0) {
                    traverseNeighbours(i, j, scope.model);
                }
                if (checkWin(scope.model)) {
                    alert('YOU WON')
                }
            }
        };

    }

    function checkWin(arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (!arr[i][j].bomb && !arr[i][j].show) {
                    return false;
                }
            }
        }
        return true;
    }

    function traverseNeighbours(i, j, arr) {
        traverse(i-1, j-1, arr);
        traverse(i-1, j, arr);
        traverse(i-1, j+1, arr);
        traverse(i, j-1, arr);
        traverse(i, j, arr);
        traverse(i, j+1, arr);
        traverse(i+1, j-1, arr);
        traverse(i+1, j, arr);
        traverse(i+1, j+1, arr);
    }

    function traverse(i, j, arr) {
        if (!arr[i] || !arr[i][j] || arr[i][j].show) {
            return;
        }

        arr[i][j].show = true;
        if (arr[i][j].neighbourCnt === 0) {
            traverseNeighbours(i, j, arr);
        }
    }

    function getRandomNumbersInRange(max, nr, arr) {
        var found = false,
            randomNumber;

        if (!arr) {
            arr = [];
        }
        randomNumber = Math.ceil(Math.random()*max);
        arr.forEach(function(el) {
            if (el === randomNumber) {
                found = true;
                return false;
            }
        });
        if (!found) {
            arr.push(randomNumber);
            if (arr.length === nr) {
                return arr;
            }
        } 
        return getRandomNumbersInRange(max, nr, arr);
    }

    function fillArrayWithObjects(arr, rowNr, colNr, bombArray) {
        for (var i = 0; i < rowNr; i++) {
            for (var j = 0; j < colNr; j++) {
                if (!arr[i]) {
                    arr[i] = [];
                }
                arr[i].push({
                    neighbourCnt: 0,
                    bomb: isBomb(rowNr * i + j + 1, bombArray)
                });
            }
        }
    }

    function findBombs(arr, rowNr, colNr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j].bomb) {
                    increaseNeighbours(arr, i, j, rowNr, colNr);
                }
            }
        }
    }

    function isBomb(nr, bombArray) {
        for (var i = 0; i < bombArray.length; i++) {
            if (nr === bombArray[i]) {
                return true;
            }
        }
        return false;
    }

    function increaseNeighbours(arr, i, j) {
        var rowNr = arr.length - 1,
            colNr = arr[i].length - 1;

        if (i > 0) {
            if (j > 0) {
                incNeighbour(arr, i-1, j-1);
            }
            incNeighbour(arr, i-1, j);
            if (j < colNr) {
                incNeighbour(arr, i-1, j+1);
            }
        }
        if (j > 0) {
            incNeighbour(arr, i, j-1);
        }
        if (j < colNr) {
            incNeighbour(arr, i, j+1);
        }
        if (i < rowNr) {
            if (j > 0) {
                incNeighbour(arr, i+1, j-1);
            }
            incNeighbour(arr, i+1, j);
            if (j < colNr) {
                incNeighbour(arr, i+1, j+1);
            }
        }
    }

    function incNeighbour(arr, i, j) {
        if (arr[i][j] && arr[i][j].bomb !== true) {
            arr[i][j].neighbourCnt++;
        }
    }

    module.directive('minesweeper', minesweeper);
})();
