var place = 1;
var funds = 100;
var betHorse = 0;
var betAmount = 0;
var announcement;
var interval = [];
var clear = [];
var direction = [];
var lap = [];
var odds = [2, 2, 2, 2];
var trackWidth;
var trackHeight;
var line;
var asideInterval;

function startButton()
{
    // source: https://freesound.org/people/qubodup/sounds/219456/
    // date: 02.03.2017
    var shot = new Audio('sounds/shot.flac');
    betHorse = document.getElementById('bethorse').value;
    betAmount = document.getElementById('amount').value;
    var laps = document.getElementById('laps').value;

    if (betAmount > funds)
    {
        announcement.innerHTML = 'Insufficient funds.';
    }
    else if (betAmount === '' || parseInt(betAmount) <= 0)
    {
        announcement.innerHTML = 'You need to specify the amount.';
    }
    else if (laps <= 0)
    {
        announcement.innerHTML = 'Wrong number of laps.';
    }
    else
    {
        announcement.innerHTML = 'Race started!';
        //shot.play();
        funds -= betAmount;
        document.getElementById('funds').innerHTML = funds;
        clearResults();
        startRace();
    }
}

function startRace()
{
    document.getElementById('start').disabled = true;
    document.getElementById('open').disabled = true;
    document.getElementById('amount').disabled = true;
    document.getElementById('laps').disabled = true;
    document.getElementById('bethorse').disabled = true;
    var horse = document.getElementsByClassName('horse');

    for (var i = 0; i < horse.length; i++)
    {
        direction[horse[i].id] = 0;
        lap[horse[i].id] = 0;
        horseRun(horse[i].id);
    }
}

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
            laps(id);
        }
    }, speed);

    clear[id] = setInterval(function()
    {
        clearInterval(interval[id]);
        clearInterval(clear[id]);
        horseRun(id);
    }, 1000);
}

function laps(id)
{
    var laps = document.getElementById('laps').value;
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

function results(id)
{
    var tr = document.getElementsByTagName('tr');
    var newPlace = document.createElement('td');
    newPlace.className = id;
    tr[place].appendChild(newPlace);
    if (place == 4)
    {
        checkWinner(tr);
        setPosition();
    }
    else
    {
        place++;
    }
}

function checkWinner(tr)
{
    if (tr[1].childNodes[3].className == betHorse)
    {
        announcement.innerHTML = 'You win!';
        funds += betAmount * 2;
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
}

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

function generateOdds()
{

}

function asideHide()
{
    var aside = document.getElementsByTagName('aside')[0];
    var positionLeft = parseInt(aside.style.marginLeft);
    aside.style.marginLeft = (positionLeft + 1) + 'px';
    if (positionLeft === 0)
    {
        clearInterval(asideInterval);
    }
}

function asideClose()
{
    var aside = document.getElementsByTagName('aside')[0];
    aside.style.marginLeft = '-240px';
    asideInterval = setInterval(asideHide, 1);
}

function asideShow()
{
    var aside = document.getElementsByTagName('aside')[0];
    var positionLeft = parseInt(aside.style.marginLeft);
    aside.style.marginLeft = (positionLeft - 1) + 'px';
    if (positionLeft == -240)
    {
        clearInterval(asideInterval);
    }
}

function asideOpen()
{
    var aside = document.getElementsByTagName('aside')[0];
    aside.style.marginLeft = '0px';
    asideInterval = setInterval(asideShow, 1);
}

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
}

document.addEventListener('DOMContentLoaded', loadFunction);
