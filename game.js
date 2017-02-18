var funds = 100;
var start;
var horse;

function startButton()
{
    console.log('Start button was pressed');
    var betHorse = document.getElementById('bethorse').value;
    var betAmount = document.getElementById('amount').value;
    if (betAmount > funds)
    {
        console.log('Insufficient funds');
    }
    else if (betAmount == '' || betAmount == 0)
    {
        console.log('You need to specify the amount');
    }
    else
    {
        console.log(betHorse);
        console.log(betAmount);
        funds -= betAmount;
        document.getElementById('funds').innerHTML = funds;
        startRace();
    }
}

function startRace()
{
    console.log('Race started');
    start.disabled = true;
    horse = document.getElementsByClassName('horse');
    for (var i = 0; i < horse.length; i++)
    {
        horse[i].className = 'horse runRight';
        //setInterval(function(){horseRun(i);}, 10);
        //horseRun(i);
    }
    setInterval(function(){horseRun(0);}, 10);
    setInterval(function(){horseRun(1);}, 7);
    setInterval(function(){horseRun(2);}, 8);
    setInterval(function(){horseRun(3);}, 9);
}

function horseRun(i)
{
    var positionLeft = horse[i].offsetLeft;
    horse[i].style.left = positionLeft + 1 + 'px';
}

function myLoadFunction()
{
    start = document.getElementById('start');
    start.addEventListener('click', startButton);

    document.getElementById('funds').innerHTML = funds;
}


document.addEventListener('DOMContentLoaded', myLoadFunction);
