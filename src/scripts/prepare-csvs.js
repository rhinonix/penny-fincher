import Papa from "papaparse";
import { readFile, writeFile } from "fs/promises";

// Default user ID for all records (you can replace this with any UUID)
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

async function prepareCSVs() {
  try {
    // Read original CSV files
    const settingsData = await readFile(
      "Household_Expenses_Settings.csv",
      "utf-8"
    );
    const transactionsData = await readFile(
      "Household_Expenses_Transactions.csv",
      "utf-8"
    );

    // Parse CSV files
    const settings = Papa.parse(settingsData, { header: true }).data;
    const transactions = Papa.parse(transactionsData, { header: true }).data;

    // 1. Prepare categories.csv
    const uniqueCategories = [
      ...new Set(settings.map((s) => s.Categories)),
    ].filter(Boolean);
    const categoriesData = uniqueCategories.map((name) => ({
      name,
      user_id: DEFAULT_USER_ID,
      created_at: new Date().toISOString(),
    }));

    // 2. Prepare accounts.csv
    const uniqueAccounts = [...new Set(settings.map((s) => s.Accounts))].filter(
      Boolean
    );
    const accountsData = uniqueAccounts.map((name) => ({
      name,
      currency: "EUR",
      user_id: DEFAULT_USER_ID,
      created_at: new Date().toISOString(),
    }));

    // 3. Prepare subcategories.csv
    const categorySubcategories = new Set();
    transactions.forEach((t) => {
      if (t.Category && t.Subcategory) {
        categorySubcategories.add(`${t.Category}|${t.Subcategory}`);
      }
    });

    const subcategoriesData = [...categorySubcategories].map((combo) => {
      const [category, name] = combo.split("|");
      return {
        name,
        category_name: category,
        user_id: DEFAULT_USER_ID,
        created_at: new Date().toISOString(),
      };
    });

    // 4. Prepare transactions.csv
    const transactionsClean = transactions.map((t) => ({
      date: new Date(t.Date).toISOString().split("T")[0],
      description: t.Description,
      category_name: t.Category,
      subcategory_name: t.Subcategory,
      amount_eur: t["Amount EUR"]
        ? parseFloat(t["Amount EUR"].replace("€", "").trim())
        : null,
      amount_usd: t["Amount USD"]
        ? parseFloat(t["Amount USD"].replace("$", "").trim())
        : null,
      account_name: t.Account,
      notes: t.Notes,
      user_id: DEFAULT_USER_ID,
      created_at: new Date().toISOString(),
    }));

    // Write the CSV files
    await writeFile(
      "import_categories.csv",
      Papa.unparse(categoriesData, {
        header: true,
        newline: "\n",
      })
    );

    await writeFile(
      "import_accounts.csv",
      Papa.unparse(accountsData, {
        header: true,
        newline: "\n",
      })
    );

    await writeFile(
      "import_subcategories.csv",
      Papa.unparse(subcategoriesData, {
        header: true,
        newline: "\n",
      })
    );

    await writeFile(
      "import_transactions.csv",
      Papa.unparse(transactionsClean, {
        header: true,
        newline: "\n",
      })
    );

    console.log("CSV files prepared successfully!");
    console.log("\nImport order:");
    console.log("1. import_categories.csv");
    console.log("2. import_accounts.csv");
    console.log("3. Update import_subcategories.csv with category_ids");
    console.log("4. Import import_subcategories.csv");
    console.log(
      "5. Update import_transactions.csv with category_ids, subcategory_ids, and account_ids"
    );
    console.log("6. Import import_transactions.csv");
  } catch (error) {
    console.error("Error preparing CSV files:", error);
  }
}

prepareCSVs();
