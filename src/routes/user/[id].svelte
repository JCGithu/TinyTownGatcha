<script>
  export let Homes;
  export let User;
  export let hasHomes;
  export let id;
  export let error;

  import HouseItem from "$lib/HouseItem.svelte";
  import { onMount } from "svelte";
  console.log(Homes);
  console.log(User);

  let extraHomes = [];

  function closestNumber(n, m) {
    let q = n / m;
    let n1 = m * q;
    let n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);
    if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;
    return n2;
  }

  onMount(() => {
    function listBuffer() {
      extraHomes = [];
      let target = 4;
      if (window.innerWidth >= 1000) target = 6;
      if (window.innerWidth >= 1300) target = 8;
      if (window.innerWidth <= 580) target = 2;
      console.log(`${target} : ${window.innerWidth}`);
      if ((User.data.length + extraHomes.length) % target === 0) return;
      let num = target * Math.ceil(User.data.length / target);
      let additional = num - User.data.length;
      extraHomes = new Array(additional);
    }
    listBuffer();
    window.addEventListener("resize", listBuffer);
  });
</script>

<div id="user">
  {#if error}
    <div id="userData">
      <h1>{id}</h1>
      <p>{error}</p>
      <p>If you haven't redeemed a home we won't have you on the database! Sorry!</p>
    </div>
  {:else}
    <div id="userData">
      <h1>{User.key}</h1>
      <p>You've unlocked {User.data.length} houses!</p>
    </div>
    <div id="houseGrid">
      {#each Homes as home, i}
        <HouseItem delay={i} {home} />
      {/each}
      {#each extraHomes as extra}
        <HouseItem blank={true} />
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  :global {
    body,
    html {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: max-content;
      font-family: "Poppins";
      background-color: #fcf9e1;
    }
    #svelteMain {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  h1 {
    color: #f9b85c;
  }
  #user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #userData {
    width: 100%;
    text-align: center;
  }
  #blank {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
  }
  #houseGrid {
    display: grid;
    width: 90vw;
    grid-template-columns: repeat(auto-fit, minmax(20vw, 1fr));
    margin-bottom: 3rem;
    min-height: 0;
    min-width: 0;
    @media (min-width: 1000px) {
      grid-template-columns: repeat(auto-fit, minmax(13vw, 1fr));
    }
    @media (min-width: 1300px) {
      grid-template-columns: repeat(auto-fit, minmax(10vw, 1fr));
    }
    @media (max-width: 580px) {
      grid-template-columns: repeat(auto-fit, minmax(40vw, 1fr));
    }
    grid-row-gap: 0.5rem;
    grid-column-gap: 1rem;
  }
</style>
