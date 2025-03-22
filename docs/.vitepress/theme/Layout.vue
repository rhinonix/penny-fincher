<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <div class="doc-footer-before">
        <hr>
        <p v-if="frontmatter.lastUpdated" class="last-updated">
          Last updated: {{ frontmatter.lastUpdated }}
        </p>
      </div>
    </template>
  </Layout>
</template>

<style>
.last-updated {
  font-size: 0.9em;
  color: #888;
  margin-top: 1em;
}
</style>