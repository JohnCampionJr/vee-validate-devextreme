<script setup lang="ts">
import { reactive } from 'vue'
import type { IClientDto } from '~/IClientDto'
import { Schema } from '~/IClientDto'
import { Field, Form, ErrorMessage } from 'vee-validate'
import type { SubmissionContext } from 'vee-validate'
import { DxField } from 'vee-validate-devextreme'
import DxTextBox from 'devextreme-vue/text-box'

const model = reactive({} as IClientDto)

const onSubmit = async (values: any, actions: SubmissionContext) => {}
</script>

<template>
  <div>
    <p class="text-4xl">
      <carbon-campsite class="inline-block" />
    </p>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank"> Vee-Validate-DevExtreme </a>
    </p>
    <p>
      <em class="text-sm opacity-75">Demo</em>
    </p>
    <Form @submit="onSubmit" :validation-schema="Schema" v-slot="{ errors, meta }">
      <div class="mt-16 max-w-md text-left mx-auto">
        <div class="mb-4">
          Errors:
          {{ errors }}
        </div>
        <div class="mb-4">
          Form Meta:
          {{ meta }}
        </div>
        <div class="mb-4">
          Model.Name:
          {{ model.name }}
        </div>
        <div class="grid grid-cols-1 gap-6">
          <label class="block">
            <span class="text-gray-700">Full name (DX)</span>
            <DxField
              v-model:value="model.name"
              name="name"
              type="text"
              :isValid="!errors.name"
              :validationError="{ message: errors.name }"
            />
          </label>
          <label class="block">
            <span class="text-gray-700">Email address</span>
            <DxField
              v-model:value="model.email"
              name="email"
              type="text"
              :isValid="!errors.email"
              :validationError="{ message: errors.email }"
            />
          </label>

          <label class="block">
            <span class="text-gray-700">Full name (Tailwind)</span>
            <input type="text" class="mt-1 block w-full" placeholder="" />
          </label>
          <label class="block">
            <span class="text-gray-700">When is your event?</span>
            <input type="date" class="mt-1 block w-full" />
          </label>
          <label class="block">
            <span class="text-gray-700">What type of event is it?</span>
            <select class="block w-full mt-1">
              <option>Corporate event</option>
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Other</option>
            </select>
          </label>
          <label class="block">
            <span class="text-gray-700">Additional details</span>
            <textarea class="mt-1 block w-full" rows="3"></textarea>
          </label>
          <div class="block">
            <div class="mt-2">
              <div>
                <label class="inline-flex items-center">
                  <input type="checkbox" checked="" />
                  <span class="ml-2">Email me news and special offers</span>
                </label>
              </div>
            </div>
          </div>
          <button class="btn">Test Button</button>
        </div>
      </div>
    </Form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
