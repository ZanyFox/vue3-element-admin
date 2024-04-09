<template>
  <div class="home-wrapper">
    <ElCard class="card" shadow="never">
      <div class="home-welcome-wrapper">
        <ElAvatar :src="userStore.avatar" class="home-avatar"/>
        <span class="home-welcome-text">欢迎 {{ userStore.name }}</span>
      </div>
    </ElCard>

    <el-row class="mt-8px" :gutter="8" justify="space-between">
      <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-8px">
        <el-card shadow="never">
          <template #header>
            <div class="h-3 flex justify-between">
              <span>开源项目</span>
            </div>
          </template>

          <el-skeleton :loading="false" animated>
            <el-row>
              <el-col
                  v-for="(item, index) in projects"
                  :key="`card-${index}`"
                  :xl="8"
                  :lg="8"
                  :md="8"
                  :sm="24"
                  :xs="24"
              >
                <a :href="item.link" target="_blank">
                  <el-card shadow="hover">
                    <div class="flex items-center">
                      <Icon :icon="item.icon" class="mr-8px"/>
                      <span class="text-16px">{{ item.name }}</span>
                    </div>
                    <!--<div class="mt-16px text-14px text-[#c7b2f1ff]">{{  item.message  }}</div>-->
                    <div class="mt-36px flex justify-between text-12px text-gray-400 items-center">
                      <span class=" text-14px text-[#c7b2f1ff]">{{ item.message }} </span>
                      <span>{{ parseTime(item.time, '{y}-{m}-{d}') }}</span>
                    </div>
                  </el-card>
                </a>
                <!--<el-card shadow="hover" @click="openLink(item.link)">-->
                <!--  <div class="flex items-center">-->
                <!--    <Icon :icon="item.icon" class="mr-8px"/>-->
                <!--    <span class="text-16px">{{ item.name }}</span>-->
                <!--  </div>-->
                <!--  &lt;!&ndash;<div class="mt-16px text-14px text-[#c7b2f1ff]">{{  item.message  }}</div>&ndash;&gt;-->
                <!--  <div class="mt-36px flex justify-between text-12px text-gray-400 items-center">-->
                <!--    <span class=" text-14px text-[#c7b2f1ff]">{{ item.message }} </span>-->
                <!--    <span>{{ parseTime(item.time, '{y}-{m}-{d}') }}</span>-->
                <!--  </div>-->
                <!--</el-card>-->
              </el-col>
            </el-row>
          </el-skeleton>
        </el-card>

        <el-card shadow="never" class="mt-8px">
          <el-skeleton :loading="loading" animated>
            <el-row :gutter="20" justify="space-between">
              <el-col :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
                <el-card shadow="hover" class="mb-8px">
                  <!--<el-skeleton :loading="loading" animated>-->
                  <!--<Echart :options="pieOptionsData" :height="280" />-->
                  <!--</el-skeleton>-->
                </el-card>
              </el-col>
              <el-col :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
                <el-card shadow="hover" class="mb-8px">
                  <el-skeleton :loading="loading" animated>
                    <!--<Echart :options="barOptionsData" :height="280" />-->
                  </el-skeleton>
                </el-card>
              </el-col>
            </el-row>
          </el-skeleton>
        </el-card>


      </el-col>

      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px">
        <el-card shadow="never">

          <el-skeleton :loading="loading" animated style="--el-skeleton-circle-size: 80px">

            <template #template>
              <div class="flex flex-items-center h-full">
                <el-skeleton-item variant="circle" style="flex: 0 1 auto" class="mr15px"/>

                <div style="width: 100%; flex: 1 1 0">
                  <el-skeleton-item variant="h3" class="w-25%"/>
                  <el-skeleton-item variant="p"/>
                  <el-skeleton-item variant="p"/>
                  <el-skeleton-item variant="p" class="w-40%"/>
                </div>
              </div>
            </template>

            <template #default>
              <el-row>
                <el-col v-for="item in shortcut" :key="`team-${item.name}`" :span="8" class="mb-8px">

                </el-col>
              </el-row>
            </template>
          </el-skeleton>

        </el-card>

      </el-col>
    </el-row>

    <el-card style="width: fit-content;">
      <el-skeleton style="width: 300px; height: 150px" :loading="loading" animated>
        <template #template>
          <div class="flex flex-items-center h-full">
            <el-skeleton-item variant="circle" style="width: 100px; height: 100px; flex: 0 0 auto" class="mr15px"/>

            <div
                style="width: 100%; display: flex; flex-direction: column; height: 100%; flex: 0 0 1; justify-content: space-around">
              <el-skeleton-item variant="h3" class="w-25%"/>
              <el-skeleton-item variant="p"/>
              <el-skeleton-item variant="p"/>
              <el-skeleton-item variant="p" class="w-40%"/>
            </div>

          </div>
        </template>

        <template #default>
          <el-row>
            <el-col v-for="item in shortcut" :key="`team-${item.name}`" :span="8" class="mb-8px">

            </el-col>
          </el-row>
        </template>
      </el-skeleton>
    </el-card>


    <el-card style="width: fit-content">
      <div class="w-300px flex ">

        <el-skeleton style="--el-skeleton-circle-size: 100px; width: 120px; margin-right: 15px"
                     class="flex justify-center flex-items-center">
          <template #template>
            <el-skeleton-item variant="circle"/>
          </template>
        </el-skeleton>

        <el-skeleton/>
      </div>
    </el-card>

  </div>
</template>

<script setup>
import userUserStore from '@/store/modules/user.js'
import {Icon} from '@iconify/vue'
import {parseTime} from '@/utils/util.js'

defineOptions({
  name: 'HomeView'
})

const userStore = userUserStore()
const loading = ref(true)

// 获取项目数
let projects = reactive([])
const getProject = () => {
  const data = [
    {
      name: 'Kubernetes',
      icon: 'logos:kubernetes',
      message: 'Kubernetes',
      link: 'https://kubernetes.io/',
      time: new Date()
    },
    {
      name: 'Vue',
      icon: 'logos:vue',
      message: 'Vue',
      link: 'https://cn.vuejs.org/',
      time: new Date()
    },
    {
      name: 'Angular',
      icon: 'logos:angular-icon',
      message: 'Angular',
      time: new Date()
    },
    {
      name: 'React',
      icon: 'logos:react',
      message: 'React',
      time: new Date()
    },
    {
      name: 'Webpack',
      icon: 'logos:webpack',
      message: 'Webpack',
      time: new Date()
    },
    {
      name: 'Vite',
      icon: 'vscode-icons:file-type-vite',
      message: 'Vite',
      time: new Date()
    }
  ]
  // 将数据复制到reactive
  let projects1 = Object.assign(projects, data)

  console.log(projects1 === projects) //true
}


getProject()

</script>

<style scoped lang="scss">

.home-wrapper {
  padding: 10px;


  .home-welcome-text {
    text-align: center;
    margin-left: 10px;
  }

}

.home-welcome-wrapper {
  display: flex;
  justify-content: start;
  align-items: center;
}

.card {
  padding: 0;
  border-radius: 10px;
}


</style>

