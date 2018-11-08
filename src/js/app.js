var DCalc = {
    state: {
        health:  4,
        demonsMax : 1,
        bonus: [0, 0, 0, 1],
        artifactSlots: []
    },

    $: function(selector){
        return document.querySelector(selector);
    },

    create: function(selector){
        return document.createElement(selector);
    },

    createCalc: function(){

    var $            = this.$,
        create       = this.create,
        calcLeftSide = $('.left-side'),
        calcCenter   = $('.center'),

        selectBtn = create('div');
        selectBtn.classList.add('select-btn', 'icon-lg');

    var numberOfCreatures = create('input');
        numberOfCreatures.setAttribute('type', 'number');
        numberOfCreatures.value = 0;

    var numberOfPitLords = create('input');
        numberOfPitLords.setAttribute('type', 'number');
        numberOfPitLords.value = 0;

    var demons = create('div');
        demons.classList.add('icon-lg')
        demons.setAttribute('id', 'demons');
        demons.innerHTML = '0(0)';

    var pitLords = create('div');
        pitLords.classList.add('icon-lg')
        pitLords.setAttribute('id', 'pit_lords');

        calcLeftSide.appendChild(selectBtn);
                                 selectBtn.appendChild(numberOfCreatures);
        calcLeftSide.appendChild(pitLords);
                                 pitLords.appendChild(numberOfPitLords);
        calcCenter.appendChild(demons); 
    },

    createBackpack: function (){
        var $ = this.$;
        var create = this.create;
        var calcRightSide = $('.right-side');
        var artifactSlots = this.state.artifactSlots;
        for(var i = 0; i<artifacts.length; i++){
            var slotName=artifacts[i].name;
            var bonusHP=artifacts[i].hp;
            artifactSlots[i]=create('div');
            artifactSlots[i].classList.add('unequipped', 'icon-lg');
            artifactSlots[i].setAttribute('id', slotName);
            artifactSlots[i].setAttribute('data-hp', bonusHP);
            artifactSlots[i].style=
            'background-image: url(img/artifacts/' + slotName + '.jpg)';
            calcRightSide.appendChild(artifactSlots[i]);
        }
    },
    
    insertData: function(){
        var $ = this.$;
        var create = this.create;
        for (var town in data) {
            //Necropolis creatures are excluded, because they can't be resurrected
            if (data.hasOwnProperty(town) && town!=='Necropolis') {
                var td = create('td');
                tbody = $('tbody');
                tbody.appendChild(td);
                    data[town].forEach(function (creature) {
                        var tr = create('tr');
                            tr.classList.add('option');
                            tr.setAttribute('data-name', creature.name);
                            tr.setAttribute('data-health', creature.hp);
                        var img = create('img');
                            img.src = creature.img;
                        tr.prepend(img);
                        td.appendChild(tr);
                    }); 
            }
        }
    },

    init: function(){
        this.createCalc();
        this.insertData();
        this.createBackpack();
    }
};

DCalc.init();