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
        selectBtn.style='background-image: url(img/creature_icons/new/Imp.jpg)';

    var numberOfCreatures = create('input');
        numberOfCreatures.setAttribute('type', 'number');
        numberOfCreatures.setAttribute('id', 'number_of_creatures');
        numberOfCreatures.value = 0;

    var numberOfPitLords = create('input');
        numberOfPitLords.setAttribute('type', 'number');
        numberOfPitLords.setAttribute('id', 'number_of_pitlords');
        numberOfPitLords.value = 0;

    var demons = create('div');
        demons.classList.add('icon-lg')
        demons.setAttribute('id', 'demons');
        demons.style='background-image: url(img/creature_icons/new/Demon.jpg)';
        demons.innerHTML = '0(0)';

    var pitLords = create('div');
        pitLords.classList.add('icon-lg')
        pitLords.setAttribute('id', 'pit_lords');
        pitLords.style='background-image: url(img/creature_icons/new/Pit_Lord.jpg)';

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

    calculateDemons: function (){
        var health      = this.state.health,
            bonus       = this.state.bonus,
            $           = this.$,
            numCreatures= $('#number_of_creatures');
            numPitLords = $('#number_of_pitlords');
            demonsMax   = Math.min(numCreatures.value, (Math.floor((numPitLords.value*50)/35))),
            bonusHealth = (bonus[0]+bonus[1]+bonus[2]),
            demons      = $('#demons');
            totalHealth = (health + bonusHealth)*bonus[3];
        demons.innerHTML= (Math.floor((totalHealth*numCreatures.value)/35)) + 
        '(' + demonsMax + ')';
    },

    stopPropagation: function (){
        var $ = this.$,
            numCreatures=$('#number_of_creatures');
            numCreatures.addEventListener('click', function(e){
            e.stopPropagation();
        });
    },

    listenInput: function(input){
        var $ = this.$,
            inputToListen = $(input),
            self = this;
            inputToListen.addEventListener('input', function(e){
            if (e.target.value < 0){
                    e.target.value = 0;
                }
                self.calculateDemons();
        });
    },

    listenSelect: function(){
        var $ = this.$,
            self=this,
            select = $('#select');
            select.classList.add('hidden'),
            selectBtn = $('.select-btn');

            selectBtn.addEventListener('click', function(e){
                revealData(select);
            });
            
            function revealData(el){
                el.classList.toggle('hidden');
                el.classList.toggle('revealed');
            }

            select.addEventListener('click', function (e) {
            var target = e.target,
                numCreatures = $('#number_of_creatures')
            while (target != select) {
                if (target.tagName == 'TR') {
                    selectBtn.style = 'background-image:url(' +
                        target.firstChild.src + ')';
                    self.state.health = +target.getAttribute('data-health');
                    numCreatures.value = 0;
                    self.calculateDemons();
                    revealData(select);
                    return;
                }
                target = target.parentNode;
            }
        });
    },

    listenBackpack: function (){
        var self=this,
            artifactSlots = this.state.artifactSlots;
            artifactSlots.forEach(function(artifact, i){
            artifact.addEventListener('click', function(){
                var bonusHP=+artifact.getAttribute('data-hp');
                var bonus = self.state.bonus;
                if(bonus[i]!==bonusHP){
                    artifact.classList.remove('unequipped');
                    bonus[i] = bonusHP;
                }else{
                    artifact.classList.add('unequipped');
                    bonus[i]=0; 
                }
                if(bonus[0] && bonus[1] && bonus[2]){
                    elixirOfLife('assemble');
                }else{
                    elixirOfLife('disassemble');
                }
                console.log(bonus);
                self.calculateDemons();
            });
        });
        function elixirOfLife(action){
            var bg = function (bg){
                return 'background-image: url(img/artifacts/' + bg + '.jpg)';
            }
            function assemble(){
                self.state.artifactSlots[0].style=bg('Locked');
                self.state.artifactSlots[1].style=bg('Locked');
                self.state.artifactSlots[2].style=bg('Elixir_of_Life');
                self.state.bonus[3]=1.25;
                self.calculateDemons();
            }
            function disassemble(){
                self.state.artifactSlots[0].style=bg('Ring_of_Life');
                self.state.artifactSlots[1].style=bg('Ring_of_Vitality');
                self.state.artifactSlots[2].style=bg('Vial_of_Lifeblood');
                self.state.bonus[3]=1;
                self.calculateDemons();
            }
            action === 'assemble' ? assemble(): disassemble();               
        }
    },

    init: function(){
        this.createCalc();
        this.insertData();
        this.createBackpack();
        this.listenInput('#number_of_creatures');
        this.listenInput('#number_of_pitlords');
        this.stopPropagation();
        this.listenSelect();
        this.listenBackpack();
    }
};

DCalc.init();