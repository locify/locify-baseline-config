<script>
  import {
    useForm,
    Hint,
    HintGroup,
    validators,
    required,
    minLength,
    email,
  } from "svelte-use-form@2.0.0";

  const form = useForm();

  let value = "2";
  let items = [];

  setTimeout(() => {
    // ajax
    items = ["Unity", "Unreal Engine"];
  }, 3000);

  let toption = "3";
  let toptionitems = [];

  setTimeout(() => {
    // ajax
    toptionitems = ["Video Ads", "Android Ads", "iOS Ads"];
  }, 3000);

  export let cvalue = "NEAR";
  export let gaming = "www.realgaming.com";

  let files;
  let array = [0],
    variable = 0;

  function handleClick() {
    alert(
      "Your Bid is is accepted. The Page will be redirected to Payment Portal"
    );
  }

  let currentDate = new Date();

  const onDateChange = (d) => {
    currentDate = d.detail;
  };
</script>

<main>
  <form use:form>
    <h1>Real-time Bid Template(RTB) Portal</h1>
    <hr />

    <p>Logged in : lawrence@gmail.com</p>
    <p>Current Date : {currentDate}</p>

    <br />
    <label for="adname">Advertisor Name</label>
    <input type="adname" name="adname" />

    <label for="templatecode">Template Option</label>
    <select bind:value>
      {#each toptionitems as toptionitems}
        <option value={toptionitems}>{toptionitems}</option>
      {/each}
    </select>

    <label for="bidprice">Minimum Bid Floor</label>
    <input type="number" name="bidprice" step="0.01" />

    <label for="cryptotype">Crypto Protocol</label>
    <input type="text" name="cryptotype" show default value={cvalue} />

    <label for="filename">File Name</label>
    <input type="file" bind:files />

    <label for="tagname">Tag Name</label>
    <input type="tagname" name="tagname" />

    <label for="title">Select a Title</label>
    <input type="title" name="title" />

    <label for="pname">Publisher Name</label>
    <select bind:value>
      {#each items as item}
        <option value={item}>{item}</option>
      {/each}
    </select>

    <label for="gaming">Domain Name</label>
    <input type="text" gaming="cryptotype" show default value={gaming} />

    <br />

    <button disabled={!$form.valid} on:click={handleClick}>
      Submit the Bid
    </button>
	<button>
		Generate JSON Req
	</button>
	<button>
		Logoff
	</button>
  </form>
  <pre>
		  {JSON.stringify($form, null, 1)}
	  </pre>
</main>

<style>
  :global(.touched:invalid) {
    border-color: blue;
    outline-color: white;
  }

  main {
    display: flex;
    justify-content: space-around;
  }

  pre {
    height: 80vh;
    overflow: auto;
    font-size: 12px;
  }
</style>
