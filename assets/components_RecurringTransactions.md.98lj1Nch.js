import{_ as a,c as i,o as n,ae as t}from"./chunks/framework.Q0oZKCXt.js";const d=JSON.parse('{"title":"RecurringTransactions Component","description":"","frontmatter":{},"headers":[],"relativePath":"components/RecurringTransactions.md","filePath":"components/RecurringTransactions.md"}'),e={name:"components/RecurringTransactions.md"};function l(r,s,h,o,p,c){return n(),i("div",null,s[0]||(s[0]=[t(`<h1 id="recurringtransactions-component" tabindex="-1">RecurringTransactions Component <a class="header-anchor" href="#recurringtransactions-component" aria-label="Permalink to &quot;RecurringTransactions Component&quot;">​</a></h1><p>The <code>RecurringTransactions</code> component provides a user interface for managing recurring transactions in PennyFincher. This component allows users to view, add, and manage recurring transactions that should be processed regularly.</p><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to &quot;Usage&quot;">​</a></h2><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RecurringTransactions </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;../components/RecurringTransactions&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> TransactionsPage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">accounts</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setAccounts</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[]&gt;([]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // Component usage</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      {</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* Other components */</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">RecurringTransactions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        accounts</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{accounts} </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        onProcessDue</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> loadTransactions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>accounts</code></td><td><code>string[]</code></td><td>Array of account names to be used in the form dropdown</td></tr><tr><td><code>onProcessDue</code></td><td><code>() =&gt; void</code></td><td>Callback function triggered after due transactions have been processed</td></tr></tbody></table><h2 id="features" tabindex="-1">Features <a class="header-anchor" href="#features" aria-label="Permalink to &quot;Features&quot;">​</a></h2><h3 id="viewing-recurring-transactions" tabindex="-1">Viewing Recurring Transactions <a class="header-anchor" href="#viewing-recurring-transactions" aria-label="Permalink to &quot;Viewing Recurring Transactions&quot;">​</a></h3><p>The component displays a table of all recurring transactions with key information:</p><ul><li>Description</li><li>Frequency</li><li>Next due date</li><li>Amounts</li><li>Category/Subcategory</li><li>Account</li><li>Status (Active/Inactive)</li></ul><h3 id="processing-due-transactions" tabindex="-1">Processing Due Transactions <a class="header-anchor" href="#processing-due-transactions" aria-label="Permalink to &quot;Processing Due Transactions&quot;">​</a></h3><p>The component provides a &quot;Process Due Transactions&quot; button that:</p><ol><li>Identifies which recurring transactions are currently due</li><li>Creates actual transactions for them in the Transactions sheet</li><li>Updates the last processed date and calculates the next due date</li></ol><h3 id="adding-new-recurring-transactions" tabindex="-1">Adding New Recurring Transactions <a class="header-anchor" href="#adding-new-recurring-transactions" aria-label="Permalink to &quot;Adding New Recurring Transactions&quot;">​</a></h3><p>The component includes a button to open the <code>RecurringTransactionFormModal</code> which handles the creation of new recurring transaction templates.</p><h3 id="managing-transaction-status" tabindex="-1">Managing Transaction Status <a class="header-anchor" href="#managing-transaction-status" aria-label="Permalink to &quot;Managing Transaction Status&quot;">​</a></h3><p>Each recurring transaction can be toggled between Active and Inactive states. Inactive transactions will not be processed automatically.</p><h2 id="implementation-details" tabindex="-1">Implementation Details <a class="header-anchor" href="#implementation-details" aria-label="Permalink to &quot;Implementation Details&quot;">​</a></h2><p>The component uses the Google Sheets service to:</p><ul><li>Fetch all recurring transactions</li><li>Process due transactions</li><li>Toggle the active status of transactions</li></ul><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">RecurringTransactions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  accounts</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Cash&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Credit Card&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Bank Account&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]} </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  onProcessDue</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Callback to refresh the main transaction list after processing</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    loadTransactions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    showNotification</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Processed recurring transactions successfully&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/&gt;</span></span></code></pre></div><h2 id="styling" tabindex="-1">Styling <a class="header-anchor" href="#styling" aria-label="Permalink to &quot;Styling&quot;">​</a></h2><p>The component uses Tailwind CSS for styling, including:</p><ul><li>Card-based layout with shadow and rounded corners</li><li>Responsive table with proper spacing</li><li>Color coding for active/inactive status</li><li>Distinctive buttons for different actions</li></ul><h2 id="related-components" tabindex="-1">Related Components <a class="header-anchor" href="#related-components" aria-label="Permalink to &quot;Related Components&quot;">​</a></h2><ul><li><a href="./RecurringTransactionFormModal.html">RecurringTransactionFormModal</a> - Modal form for adding new recurring transactions</li></ul>`,27)]))}const g=a(e,[["render",l]]);export{d as __pageData,g as default};
