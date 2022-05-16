<script>
  //IMPORTS
  import houseData from "$lib/allHouses.json";
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { elasticOut, sineIn } from "svelte/easing";
  import async from "async";

  //VARIABLES
  let userName, houseNum, chosenHouse;
  let first = false;
  let listOfHouses = Object.keys(houseData);
  let numberOfHouses = listOfHouses.length;

  //FUNCTIONS
  function randomNum(max) {
    return Math.floor(Math.random() * max);
  }

  let asyncQueue = async.queue(function (task, callback) {
    task.then((output) => {
      callback(output);
    });
  }, 1);

  async function getHouse(data) {
    houseNum = randomNum(numberOfHouses);
    //
    let sending = {
      username: data.userName,
      number: houseNum,
    };
    console.log(sending);
    const res = await fetch("/api", {
      method: "POST",
      body: JSON.stringify(sending),
    });
    console.log(res.status);
    const json = await res.json();
    if (!json.works) return;
    if (json.first) first = true;
    userName = data.userName;
    chosenHouse = houseData[listOfHouses[houseNum]];
    console.log(chosenHouse);

    return new Promise((res) => {
      setTimeout(() => {
        chosenHouse = null;
        first = false;
        res();
      }, 10000);
    });
  }

  function spin(node, { duration, delay, deg }) {
    return {
      duration,
      deg,
      delay,
      css: (t) => {
        const eased = elasticOut(t);

        return `transform: scale(${eased}) rotate(${deg - eased * deg}deg);`;
      },
    };
  }

  onMount(() => {
    const StreamerBot = new WebSocket("ws://localhost:8080/");

    StreamerBot.onopen = () => {
      console.log("Connected to StreamerBot");
      let Subscribe = {
        request: "Subscribe",
        events: {
          Twitch: ["Follow", "Cheer", "Sub", "Resub", "GiftSub", "GiftBomb", "RewardRedemption"],
        },
        id: "123",
      };
      StreamerBot.send(JSON.stringify(Subscribe));
      StreamerBot.onmessage = (data) => {
        console.log("Redeem triggered");
        data = JSON.parse(data.data).data;
        console.log(data);
        if (!data) return;
        if (data.rewardId === "774e6571-18da-4dda-b54d-cf7e47b4a668") {
          console.log("REDEEMED!");
          asyncQueue.push(getHouse(data));
        }
      };
    };
  });
  //let col1 = "blue";
  //chosenHouse = houseData[listOfHouses[20]];
  //first = true;
</script>

{#if chosenHouse}
  <div id="eventBox">
    {#if first}
      <img transition:scale id="first" src="https://www.svgrepo.com/show/301691/medal.svg" />
    {/if}
    <img in:spin={{ duration: 1500, deg: 15 }} out:scale={{ easing: sineIn }} alt="home" src={`https://raw.githubusercontent.com/JCGithu/tinytown/5dea411a91e270fbfb7d887c2ac27d6aa408d07d/houseData/images/${chosenHouse.img}`} />
    <div id="info" in:spin={{ delay: 200, duration: 3000, deg: -15 }} out:scale={{ easing: sineIn }}>
      <div style={`background-color: #${chosenHouse.col1}; color: #${chosenHouse.col2}`}>
        <h1>{userName}</h1>
        <p>You unlocked {chosenHouse.owner}'s house!</p>
      </div>
    </div>
    <!-- <img in:spin={{ delay: 1000, duration: 3000, deg: 0 }} out:scale={{ easing: sineIn, duration: 200 }} id="explode" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Explosion-155624_icon.svg" /> -->
  </div>
{/if}

<style lang="scss">
  :global {
    body,
    html {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: max-content;
      font-family: "Poppins";
      overflow: hidden;
    }
    #svelteMain {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  #eventBox {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
    transform: scale(0.8);
    img {
      width: 60vw;
      height: 60vw;
    }
    h1 {
      margin: 0;
      padding: 0;
      font-size: 10vh;
    }
    p {
      font-size: 4vh;
      margin: 0;
    }
  }
  #info {
    width: 100vw;
    height: max-content;
    position: absolute;
    bottom: 0vh;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
    div {
      width: max-content;
      height: max-content;
      padding: 1rem 3rem;
      background-color: #fcf9e186;
      border-radius: 5rem;
      //color: white;
    }
  }
  #explode {
    z-index: -1;
    position: absolute;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
  }
  #first {
    transform: rotate(20deg);
    position: absolute;
    z-index: 2;
    max-width: 20vw;
    top: 10vw;
    right: 10vw;
  }
</style>
