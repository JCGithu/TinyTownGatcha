<script>
  export let home = {
    owner: "",
    title: "",
    notes: "",
  };
  export let delay = 0;
  export let blank = false;
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { elasticOut } from "svelte/easing";

  import blankHome from "$lib/blankHome.svg";
  let imgUrl = blankHome;

  let show = false;
  onMount(() => {
    show = true;
  });

  if (!blank) imgUrl = `https://raw.githubusercontent.com/JCGithu/tinytown/5dea411a91e270fbfb7d887c2ac27d6aa408d07d/houseData/images/${home.img}`;
</script>

{#if show}
  <div in:scale={{ delay: 100 * delay, easing: elasticOut, duration: 1000 }} class={blank ? "houseBox blank" : "houseBox"}>
    <img src={imgUrl} />
    <div>
      <h3>{home.owner ? home.owner : ""}{home.title ? " - " + home.title : ""}</h3>
      <p transition:fade>{home.notes ? home.notes : ""}</p>
    </div>
  </div>
{/if}

<style lang="scss">
  .houseBox {
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    transition: all 3s cubic-bezier(0.075, 0.82, 0.165, 1);
    div {
      margin: 0.5rem 0;
    }
    p {
      opacity: 0;
      transition: all 5s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    img {
      filter: drop-shadow(15px 15px 15px transparent);
    }
    &:hover {
      transform: scale(1.1);
      img {
        filter: drop-shadow(15px 15px 15px rgb(0 0 0 / 0.4));
      }
      p {
        opacity: 1;
      }
    }
  }
  h3 {
    margin: 0;
  }
  p {
    margin: 0;
  }
  .blank {
    opacity: 0.1;
    &:nth-child(1) {
      transform: scale(0.5);
    }
    &:hover {
      opacity: 0.7;
    }
  }
</style>
