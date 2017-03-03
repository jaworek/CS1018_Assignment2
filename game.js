var funds = 100;
var betHorse = 0;
var betAmount = 0;
var interval = [];
var clear = [];
var direction = [];
// source: https://freesound.org/people/qubodup/sounds/219456/
// date: 02.03.2017
var shot = new Audio('sounds/shot.flac');

function startButton()
{
    betHorse = document.getElementById('bethorse').value;
    betAmount = document.getElementById('amount').value;
    console.log('Start button was pressed');

    if (betAmount > funds)
    {
        console.log('Insufficient funds');
    }
    else if (betAmount === '' || parseInt(betAmount) <= 0)
    {
        console.log('You need to specify the amount');
    }
    else
    {
        console.log(betHorse);
        console.log(betAmount);
        shot.play();
        funds -= betAmount;
        document.getElementById('funds').innerHTML = funds;
        startRace();
    }
}

function startRace()
{
    console.log('Race started');
    start.disabled = true;
    var horse = document.getElementsByClassName('horse');

    for (var i = 0; i < horse.length; i++)
    {
        direction[horse[i].id] = 0;
        horseRun(horse[i].id);
    }
}

function horseRun(id)
{
    var trackWidth = document.getElementById('track').offsetWidth;
    var trackHeight = document.getElementById('track').offsetHeight;
    var horse = document.getElementById(id);
    var speed = Math.ceil(Math.random() * 4 + 6);
    var line = document.getElementById('startline').parentNode.offsetLeft + document.getElementById('startline').offsetLeft;

    interval[id] = setInterval(function()
    {
        var positionLeft = horse.offsetLeft;
        var positionTop = horse.offsetTop;

        switch (direction[id])
        {
            case 0:
                horse.className = 'horse runRight';
                horse.style.left = positionLeft + 1 + 'px';
                break;
            case 1:
                horse.className = 'horse runDown';
                horse.style.top = positionTop + 1 + 'px';
                break;
            case 2:
                horse.className = 'horse runLeft';
                horse.style.left = positionLeft - 1 + 'px';
                break;
            case 3:
                horse.className = 'horse runUp';
                horse.style.top = positionTop - 1 + 'px';
                break;
            default:
                console.log('Error');
        }

        var turnChance = Math.ceil(Math.random() * 50);

        // top-right corner
        if (positionLeft + 80 > trackWidth * 0.875 && positionTop < trackHeight * 0.1875)
        {
            if (turnChance == 50 || positionLeft + 96 == trackWidth)
            {
                direction[id] = 1;
            }
        }

        // bottom-right corner
        if (positionTop + 64 > trackHeight * 0.8125 && positionLeft + 48 > trackWidth * 0.875)
        {
            console.log('box2');
            if (turnChance == 50 || positionTop + 88 == trackHeight)
            {
                direction[id] = 2;
            }
        }

        // bottom-left corner
        if (positionTop + 64 > trackHeight * 0.8125 && positionLeft + 72 < trackWidth * 0.125)
        {
            if (turnChance == 50 || positionLeft + 44 == 0)
            {
                direction[id] = 3;
            }
        }

        // top-left corner
        if (positionTop + 64 < trackHeight * 0.1875 && positionLeft < trackWidth * 0.125)
        {
            if (turnChance == 50 || positionTop == Math.floor(trackHeight * (-0.02)))
            {
                direction[id] = 0;
            }
        }
        /*
                                        // line
                                        if (positionTop > 0 && positionTop <= screenHeight * 0.16 && positionLeft + 96 == line)
                                        {
                                            clearInterval(interval[id]);
                                            clearInterval(clear[id]);
                                            horse.className = 'horse standRight';
                                            results(id);
                                        }*/
    }, speed);
    clear[id] = setInterval(function()
    {
        clearInterval(interval[id]);
        clearInterval(clear[id]);
        horseRun(id);
    }, 1000);
}

var i = 1;

function results(id)
{
    var results = document.getElementById('results');
    var place = results.getElementsByTagName('tr');
    var newPlace = document.createElement('td');
    newPlace.className = id;
    place[i].appendChild(newPlace);
    i++;
}

function myLoadFunction()
{
    var start = document.getElementById('start');
    start.addEventListener('click', startButton);

    document.getElementById('funds').innerHTML = funds;
}

document.addEventListener('DOMContentLoaded', myLoadFunction);
