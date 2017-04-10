// v Создавать в ней th из объекта
// v Создавать в ней td из объекта
// v Создать функцию филтрации по инпуту.
// v Создать функцию филтрации по возрасту.
// v Создать функцию филтрации по именам.
// v Создать функцию филтрации по никнейму.
// v Создать 'выбрать всё/снять всё' на чекбоксах.
// v При клике на строку таблицы значения полей выводятся в дополнительном блоке под таблицей.
// v При выборе большой, средний, свой - прилетает три разных ответа с сервера.


var mainObj = (function() {
    var server = 'https://jsonplaceholder.typicode.com/comments',
        container = document.querySelector('.container'),
        getTable,
        getInput,
        data,
        limit;

    // Получаем данные.
    function Get(yourUrl) {
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.open("GET",yourUrl,false);
        Httpreq.send(null);
        return Httpreq.responseText;
    }
    data = JSON.parse(Get(server));

    return {
        // Создаем весь необходимій html
        createHtmlElements: function() {
            var form = document.createElement('form'),
                fieldset = document.createElement('fieldset'),
                span = document.createElement('span'),
                input = document.createElement('input');
            span.innerHTML = 'Набор данных: ';


            function makeRadioButton(name, value, text) {
                var label = document.createElement("label");
                var radio = document.createElement("input");
                radio.type = "radio";
                radio.name = name;
                radio.value = value;

                label.appendChild(radio);
                label.appendChild(document.createTextNode(text));
                return label;
            }

            var big = makeRadioButton("datatype", "big", "Большой");
            var small = makeRadioButton("datatype", "small", "Маленький");
            var own = makeRadioButton("datatype", "own", "Свой");
            form.appendChild(big);
            form.appendChild(small);
            form.appendChild(own);
            container.appendChild(form);



            input.className = 'input';
            getInput = input;
            container.appendChild(input);

        },

        // Обрабатываем величину таблицы
        listenRadio: function() {
            // С radio кнопок получаю какого типа будет таблица.
            var radioButtons = container.querySelectorAll('input[type="radio"]'),
                tableType;

            container.addEventListener('click', function(e){
                // С radio кнопок получаю какого типа будет таблица.
                if(e.target.tagName == "INPUT" && e.target.type == 'radio') {
                    tableType = e.target.value;
                    // Устанавливаю количество строк в таблице.
                    switch(tableType) {
                        case 'big': limit = 50;
                            break;
                        case 'small': limit = 30;
                            break;
                        case 'own': limit = 10;
                            break;
                    }
                    mainObj.createTable();
                    mainObj.listenTh();
                    mainObj.showTr();
                }
            })
        },

        // Создаем таблицу
        createTable: function() {
            var table = document.createElement('table'),
                trHead =  document.createElement('tr'),
                th,
                x,
                trBody,
                td,
                i,
                j;

            // Создаю th
            for(x = 0; x <= 3; x++) {
                th = document.createElement('th');
                switch(x) {
                    case 0:
                        th.innerText = 'Name';
                        th.className = 'name';
                        break;
                    case 1:
                        th.innerText = 'Age';
                        th.className = 'age';
                        break;
                    case 2:
                        th.innerText = 'Nickname';
                        th.className = 'nickname';
                        break;
                    case 3:
                        th.innerText = 'Employee';
                        th.className = 'employee';
                        break;
                }
                trHead.appendChild(th);
                table.appendChild(trHead);
            }

            // Создаю td
            for(i = 0; i < limit; i += 1) {
                trBody = document.createElement('tr');
                for(j = 0; j <= 3; j += 1) {
                    td = document.createElement('td');
                    switch(j) {
                        case 0:
                            // Делаю имя чуть короче потому что с сервера просто строка приходит.
                            td.innerText = data[i].name.slice(0, 10);
                            break;
                        case 1:
                            // Возраста нет в данных с сервера, генерирую здесь.
                            td.innerText = Math.floor(Math.random() * 100);
                            break;
                        case 2:
                            td.innerText = data[i].email;
                            break;
                        case 3:
                            td.innerHTML = '<input type="checkbox" >';
                            break;
                    }
                    trBody.appendChild(td);
                }
                table.appendChild(trBody);
            }
            table.className = 'table';
            getTable = table;
            container.appendChild(table);
        },

        // Получаем заголовки и начинаем их слушать.
        listenTh: function (){
            var age = document.querySelector('.age'),
                name = document.querySelector('.name'),
                nickname = document.querySelector('.nickname'),
                employee = document.querySelector('.employee'),
                table = getTable,
                that = this,
                check = false,
                flag = 'age',
                checkbox;

            // Вызываю филтрацию при нажатии на кнопку
            name.addEventListener('click', this.sortTd);
            age.addEventListener('click', function(){
                that.sortTd(flag);
            });
            nickname.addEventListener('click', this.sortTd);
            employee.addEventListener('click', function(){
                checkbox = table.querySelectorAll('input[type="checkbox"]');
                if(check) {
                    checkbox.forEach(function(el){
                        el.checked = false;
                    });
                    check = false;
                } else {
                    checkbox.forEach(function(el){
                        el.checked = true;
                    });
                    check = true;
                }

            });

        },

        // Сортировка для инпута
        sortForInput: function() {
            var td,
                val = getInput.value.toLowerCase(),
                table = getTable,
                tr = table.getElementsByTagName("tr");
            // Начинаем с единицы, потому что в tr[0] лежат th из-зa этого прилетает undefined.
            for (var i = 1; i < tr.length; i += 1) {
                td = tr[i].getElementsByTagName("td")[0];
                if(td) {
                    if(td.innerHTML.toLowerCase().indexOf(val) > -1) {
                        tr[i].style.display = '';
                    } else {
                        tr[i].style.display = 'none';
                    }
                }
            }
        },

        // Сортировка в алфавитном порядке и обратно, если флаг 'age' то сравнивает как числа,  а не как строки.
        sortTd: function(flag) {
            var switching,
                direction,
                tr,
                i,
                a,
                b,
                count = 0,
                shouldSwitch;
            switching = true;
            direction = 'abc';

            while(switching) {
                switching = false;
                tr = document.getElementsByTagName('TR');
                if(flag == 'age') {
                    // Начинаем с одного что бы пропустить th
                    for(i = 1; i < tr.length-1; i += 1) {
                        shouldSwitch = false;
                        a = tr[i].getElementsByTagName("TD")[1];
                        b = tr[i+1].getElementsByTagName("TD")[1];
                        if(direction == "abc") {
                            if(+(a.innerHTML) > +(b.innerHTML)) {
                                shouldSwitch  = true;
                                break;
                            }
                        } else if (direction == "zyx"){
                            if(a.innerHTML.toLowerCase() < b.innerHTML.toLowerCase()) {
                                shouldSwitch  = true;
                                break;
                            }
                        }
                    }
                } else {
                    // Начинаем с одного что бы пропустить th
                    for(i = 1; i < tr.length-1; i += 1) {
                        shouldSwitch = false;
                        a = tr[i].getElementsByTagName("TD")[0];
                        b = tr[i+1].getElementsByTagName("TD")[0];
                        if(direction == "abc") {
                            if(a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase()) {
                                shouldSwitch  = true;
                                break;
                            }
                        } else if (direction == "zyx"){
                            if(a.innerHTML.toLowerCase() < b.innerHTML.toLowerCase()) {
                                shouldSwitch  = true;
                                break;
                            }
                        }
                    }
                }

                if(shouldSwitch) {
                    tr[i].parentNode.insertBefore(tr[i + 1], tr[i]);
                    switching = true;
                    count++;
                } else {
                    if(count == 0 && direction == "abc") {
                        direction = "zyx";
                        switching = true;
                    }
                }
            }
        },

        // Вывод tr под таблицу при нажатии на него.
        showTr: function() {
            var table = getTable,
                str,
                p;
            table.onclick = function(e) {
                if(e.target.tagName === "TD") {
                    var name = e.target.parentNode.childNodes[0].innerHTML,
                        age = e.target.parentNode.childNodes[1].innerHTML,
                        nickname = e.target.parentNode.childNodes[2].innerHTML,
                        tr = e.target.parentNode,
                        checkbox = tr.querySelector('input[type="checkbox"]'),
                        personState = '';
                    checkbox.checked === true ? personState = ', is employed' : personState = ', is NOT employed';

                    str = 'Выбрано: ' + ' ' + name + '(' + age + ', ' + nickname + personState + ')';
                    p = document.createElement('p');
                    p.innerHTML = str;
                    container.appendChild(p)
                }

            }
        },

        // Инициализация
        init: function () {
            mainObj.createHtmlElements();
            mainObj.listenRadio();
            // Обработчик ввода в инпут
            getInput.addEventListener('keyup', this.sortForInput);
        }
    }

})();

mainObj.init();
