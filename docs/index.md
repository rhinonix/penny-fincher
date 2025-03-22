---
layout: home
title: PennyFincher Documentation
hero:
  name: PennyFincher
  text: Personal Finance Tracker
  tagline: A free and open-source solution for tracking your finances with Google Sheets integration
  image:
    src: /logo.svg
    alt: PennyFincher Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/rhinonix/penny-fincher

features:
  - icon: 📊
    title: Dashboard
    details: Interactive dashboard with financial overview and data visualizations
  - icon: 💰
    title: Transaction Management
    details: Easy tracking and categorizing of your expenses and income
  - icon: 📅
    title: Budget Tracking
    details: Set and monitor spending goals for different categories
  - icon: 📈
    title: Reports
    details: Analyze your spending patterns across categories and time periods
  - icon: 🔄
    title: Google Sheets Integration
    details: Secure data storage in your own Google Sheets document
  - icon: 🎨
    title: Custom Categories
    details: Organize transactions with your own hierarchy of categories and subcategories
---

<div class="spacer"></div>

# PennyFincher Documentation

Welcome to the PennyFincher documentation. PennyFincher is a personal finance tracking application that helps you manage your expenses and budget.

## Explore

<div class="features">
  <div class="feature">
    <h3><a href="./guide/">Guide</a></h3>
    <p>Learn how to set up and use PennyFincher</p>
  </div>
  <div class="feature">
    <h3><a href="./api/">API Reference</a></h3>
    <p>Understand the core services and components</p>
  </div>
  <div class="feature">
    <h3><a href="./components/">Components</a></h3>
    <p>Explore the React components used in PennyFincher</p>
  </div>
</div>

<style>
.features {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0;
}
.feature {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(76, 175, 80, 0.1);
}
.spacer {
  height: 3rem;
}
</style>
