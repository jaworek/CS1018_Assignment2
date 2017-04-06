// bet variables
var place = 1;
var funds = 100;
var betHorse = 0;
var betAmount = 0;
// run variables
var interval = [];
var clear = [];
var direction = [];
var lap = [];
// track variables
var trackWidth;
var trackHeight;
var line;
var laps;
// timer variables
var timer;
var ticks = 0;
// other variables
var announcement;
var oddsTable = [];
var asideInterval;

// called after button was pressed, checks if all input data is correct and starts the race
function startButton()
{
    betHorse = document.getElementById('bethorse').value;
    betAmount = document.getElementById('amount').value;
    laps = document.getElementById('laps').value;

    if (betAmount > funds)
    {
        announcement.innerHTML = 'Insufficient funds.';
    }
    else if (betAmount === '' || betAmount <= 0)
    {
        announcement.innerHTML = 'You need to specify the amount.';
    }
    else
    {
        announcement.innerHTML = 'Race started!';

        funds -= betAmount;
        document.getElementById('funds').innerHTML = funds;

        clearResults();
        startRace();
    }
}

// starts the race, blocks all inputs
function startRace()
{
    // source: https://freesound.org/people/qubodup/sounds/219456/
    // date: 02.03.2017
    var shot = new Audio('sounds/shot.flac');
    //shot.play();

    ticks = 0;
    timer = setInterval(timerStart, 10);

    asideClose();

    document.getElementById('start').disabled = true;
    document.getElementById('open').disabled = true;
    document.getElementById('amount').disabled = true;
    document.getElementById('laps').disabled = true;
    document.getElementById('bethorse').disabled = true;

    var horses = document.getElementsByClassName('horse');

    for (var i = 0; i < horses.length; i++)
    {
        direction[horses[i].id] = 0;
        lap[horses[i].id] = 0;
        horseRun(horses[i].id);
    }
}

// makes each horse run, turn and stop
function horseRun(id)
{
    var horse = document.getElementById(id);
    var speed = Math.ceil(Math.random() * 4 + 6);
    var positionLeft = horse.offsetLeft;
    var positionTop = horse.offsetTop;

    interval[id] = setInterval(function()
    {
        var turnChance = Math.ceil(Math.random() * 50);

        switch (direction[id])
        {
            case 0:
                horse.className = 'horse runRight';
                horse.style.left = positionLeft + 1 + 'px';
                positionLeft++;

                // top-right corner
                if (positionLeft + 80 > trackWidth * 0.875 && positionTop < trackHeight * 0.1875)
                {
                    if (turnChance == 50 || positionLeft + 96 == trackWidth)
                    {
                        direction[id] = 1;
                    }
                }
                break;
            case 1:
                horse.className = 'horse runDown';
                horse.style.top = positionTop + 1 + 'px';
                positionTop++;

                // bottom-right corner
                if (positionTop + 64 > trackHeight * 0.8125 && positionLeft + 48 > trackWidth * 0.875)
                {
                    if (turnChance == 50 || positionTop + 88 == trackHeight)
                    {
                        direction[id] = 2;
                    }
                }
                break;
            case 2:
                horse.className = 'horse runLeft';
                horse.style.left = positionLeft - 1 + 'px';
                positionLeft--;

                // bottom-left corner
                if (positionTop + 64 > trackHeight * 0.8125 && positionLeft + 72 < trackWidth * 0.125)
                {
                    if (turnChance == 50 || positionLeft + 44 === 0)
                    {
                        direction[id] = 3;
                    }
                }
                break;
            case 3:
                horse.className = 'horse runUp';
                horse.style.top = positionTop - 1 + 'px';
                positionTop--;

                // top-left corner
                if (positionTop + 64 < trackHeight * 0.1875 && positionLeft < trackWidth * 0.125)
                {
                    if (turnChance == 50 || positionTop == Math.floor(trackHeight * (-0.02)))
                    {
                        direction[id] = 0;
                    }
                }
                break;
            default:
                console.log('Error');
        }
        // line
        if (positionTop + 64 < trackHeight * 0.1875 && positionLeft + 84 == line)
        {
            lapCounter(id);
        }
    }, speed);

    clear[id] = setInterval(function()
    {
        clearInterval(interval[id]);
        clearInterval(clear[id]);
        horseRun(id);
    }, 1000);
}

// tracks number of laps that each horse completed
function lapCounter(id)
{
    var horse = document.getElementById(id);
    lap[id]++;
    if (lap[id] == laps)
    {
        clearInterval(interval[id]);
        clearInterval(clear[id]);
        horse.className = 'horse standRight';
        results(id);
    }
}

// displays results table
function results(id)
{
    var tr = document.getElementsByTagName('tr');
    var newPlace = document.createElement('td');
    newPlace.className = id;
    tr[place].appendChild(newPlace);
    if (place == 4)
    {
        clearInterval(timer);
        checkWinner(tr);
        setPosition();
    }
    else
    {
        place++;
    }
}

// clears result table
function clearResults()
{
    place = 1;
    for (var i = 0; i < 4; i++)
    {
        var test = document.getElementsByClassName('horse' + (i + 1));
        if (test.length > 0)
        {
            test[0].parentNode.removeChild(test[0]);
        }
    }
}

// checks which horse won
function checkWinner(tr)
{
    var winner = tr[1].childNodes[3].className;
    if (winner == betHorse)
    {
        announcement.innerHTML = 'You win!';
        funds += betAmount * oddsTable[betHorse];
        document.getElementById('funds').innerHTML = funds;
    }
    else
    {
        announcement.innerHTML = 'You lose. Better luck next time.';
    }
    document.getElementById('start').disabled = false;
    document.getElementById('open').disabled = false;
    document.getElementById('amount').disabled = false;
    document.getElementById('laps').disabled = false;
    document.getElementById('bethorse').disabled = false;

    generateOdds(winner);
}

// generates odds for each horse
function initializeOdds()
{
    var odds = document.getElementById('odds');
    var record = odds.getElementsByTagName('span');
    for (var i = 0; i < record.length; i++)
    {
        oddsTable['horse' + (i + 1)] = Math.ceil(Math.random() * 4) + 1;
        record[i].innerHTML = oddsTable['horse' + (i + 1)];
    }
}

function generateOdds(winner)
{
    var odds = document.getElementById('odds');
    var record = odds.getElementsByTagName('span');
    for (var i = 0; i < record.length; i++)
    {
        if (winner == 'horse' + (i + 1))
        {
            Math.ceil(oddsTable['horse' + (i + 1)] /= 2);
            if (oddsTable['horse' + (i + 1)] < 2)
            {
                oddsTable['horse' + (i + 1)] = 2;
            }
        }
        else
        {
            Math.ceil(oddsTable['horse' + (i + 1)] *= 1.5);
        }
        record[i].innerHTML = oddsTable['horse' + (i + 1)];
    }
}

// sets randomly position of the horse at the start
function setPosition()
{
    var position = [-0.03, 0.01, 0.05, 0.09];
    var used = [];

    for (var i = 1; i < 5; i++)
    {
        var repeated = true;
        var randomPosition;
        while (repeated)
        {
            randomPosition = Math.floor(Math.random() * 4);

            var alreadyUsed = false;
            for (var j = 0; j < used.length; j++)
            {
                if (used[j] == randomPosition)
                {
                    alreadyUsed = true;
                }
            }

            if (alreadyUsed === false)
            {
                used.push(randomPosition);
                repeated = false;
            }
        }
        document.getElementById('horse' + i).style.top = window.innerHeight * position[randomPosition] + 'px';
        document.getElementById('horse' + i).style.zIndex = 996 + randomPosition;
    }
}

// open, close and animate aside
// source: Thomas Butler, https://github.com/CSY1018/Topic4
function asideHide()
{
    var aside = document.getElementsByTagName('aside')[0];
    var positionLeft = parseInt(aside.style.marginLeft);
    if (positionLeft === 0)
    {
        clearInterval(asideInterval);
    }
    else
    {
        aside.style.marginLeft = (positionLeft + 1) + 'px';
    }
}

function asideClose()
{
    var aside = document.getElementsByTagName('aside')[0];
    asideInterval = setInterval(asideHide, 1);
}

function asideShow()
{
    var aside = document.getElementsByTagName('aside')[0];
    var positionLeft = parseInt(aside.style.marginLeft);
    if (positionLeft == -240)
    {
        clearInterval(asideInterval);
    }
    else
    {
        aside.style.marginLeft = (positionLeft - 1) + 'px';
    }
}

function asideOpen()
{
    var aside = document.getElementsByTagName('aside')[0];
    aside.style.marginLeft = '0px';
    asideInterval = setInterval(asideShow, 1);
}

// tracks and displays time during the race
function timerStart()
{
    ticks++;
    var csec = ticks % 100;
    var sec = Math.floor((ticks / 100) % 60);
    var min = Math.floor((ticks / 6000));
    if (csec < 10)
    {
        document.getElementById('csec').innerHTML = '0' + csec;
    }
    else
    {
        document.getElementById('csec').innerHTML = csec;
    }
    if (sec < 10)
    {
        document.getElementById('sec').innerHTML = '0' + sec;
    }
    else
    {
        document.getElementById('sec').innerHTML = sec;
    }
    if (min < 10)
    {
        document.getElementById('min').innerHTML = '0' + min;
    }
    else
    {
        document.getElementById('min').innerHTML = min;
    }
}

// initializes and loads all necessary data
function loadFunction()
{
    var start = document.getElementById('start');
    start.addEventListener('click', startButton);

    var close = document.getElementById('closeside');
    close.addEventListener('click', asideClose);
    var open = document.getElementById('open');
    open.addEventListener('click', asideOpen);

    trackWidth = document.getElementById('track').offsetWidth;
    trackHeight = document.getElementById('track').offsetHeight;
    line = document.getElementById('startline').offsetLeft;

    announcement = document.getElementById('announcement');

    setPosition();
    initializeOdds();

    var aside = document.getElementsByTagName('aside')[0];
    aside.style.marginLeft = '0px';
}

document.addEventListener('DOMContentLoaded', loadFunction);
