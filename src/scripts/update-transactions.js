import Papa from "papaparse";
import { readFile, writeFile } from "fs/promises";

async function updateTransactions() {
  try {
    // Read all CSV files
    const categoriesData = await readFile("categories_rows.csv", "utf-8");
    const subcategoriesData = await readFile("subcategories_rows.csv", "utf-8");
    const accountsData = await readFile("accounts_rows.csv", "utf-8");
    const transactionsData = await readFile("import_transactions.csv", "utf-8");

    // Parse all CSVs
    const categories = Papa.parse(categoriesData, { header: true }).data;
    const subcategories = Papa.parse(subcategoriesData, { header: true }).data;
    const accounts = Papa.parse(accountsData, { header: true }).data;
    const transactions = Papa.parse(transactionsData, { header: true }).data;

    // Create maps for looking up IDs
    const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));
    const accountMap = new Map(accounts.map((acc) => [acc.name, acc.id]));

    // Create map for subcategories using category name + subcategory name as key
    const subcategoryMap = new Map();
    subcategories.forEach((sub) => {
      const category = categories.find((cat) => cat.id === sub.category_id);
      if (category) {
        const key = `${category.name}|${sub.name}`;
        subcategoryMap.set(key, sub.id);
      }
    });

    // Update transactions with correct IDs
    const updatedTransactions = transactions.map((transaction) => {
      const categoryId = categoryMap.get(transaction.category_name);
      const subcategoryId = transaction.subcategory_name
        ? subcategoryMap.get(
            `${transaction.category_name}|${transaction.subcategory_name}`
          )
        : null;
      const accountId = transaction.account_name
        ? accountMap.get(transaction.account_name)
        : null;

      if (!categoryId && transaction.category_name) {
        console.warn(
          `Warning: No category ID found for category name: ${transaction.category_name}`
        );
      }
      if (!subcategoryId && transaction.subcategory_name) {
        console.warn(
          `Warning: No subcategory ID found for subcategory name: ${transaction.subcategory_name} in category: ${transaction.category_name}`
        );
      }
      if (!accountId && transaction.account_name) {
        console.warn(
          `Warning: No account ID found for account name: ${transaction.account_name}`
        );
      }

      return {
        date: transaction.date,
        description: transaction.description,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        amount_eur: transaction.amount_eur,
        amount_usd: transaction.amount_usd,
        account_id: accountId,
        notes: transaction.notes,
        user_id: transaction.user_id,
        created_at: transaction.created_at,
      };
    });

    // Write the updated transactions to a new CSV
    await writeFile(
      "import_transactions_with_ids.csv",
      Papa.unparse(updatedTransactions, {
        header: true,
        newline: "\n",
      })
    );

    console.log("Successfully created import_transactions_with_ids.csv");
    console.log(`Processed ${updatedTransactions.length} transactions`);
    console.log("\nSummary of potential issues:");
    console.log(
      "- Check the console output above for any warnings about missing IDs"
    );
    console.log("- Verify the new file before importing to Supabase");
  } catch (error) {
    console.error("Error updating transactions:", error);
  }
}

updateTransactions();
