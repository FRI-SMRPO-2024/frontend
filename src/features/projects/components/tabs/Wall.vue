<script setup lang="ts">
import emitter from "@/plugins";
import { useField, useForm } from "vee-validate";
import { useAxios } from "@/composables/useAxios";
import { Loader } from "@/components/Common";
import { Alert } from "@/components/Alert";
import { useToast } from "vue-toast-notification";
import { Project } from "@/features/projects";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import { ProjectWall, User } from "../../types";

type WallProps = {
  project: Project;
};

const userStore = useUserStore();
const props = defineProps<WallProps>();

// Define the schema outside of the `useForm` call
const schema = {
  post: (value: string | null) => {
    if (value) return true;
    return "Post is required!";
  },
};

// Then call useForm with the defined schema
const { handleSubmit } = useForm({
  validationSchema: schema,
});

const newPost = useField("post");

const currentUserId = ref<string>("");
const posts = ref<{ user: User; post: ProjectWall }>([]);

onBeforeMount(async () => {
  await fetchWall();
  console.log(posts);
});

const fetchWall = async () => {
  posts.value = [];
  getWall().then((res: ProjectWall[]) => {
    if (res) {
      res.forEach((post) => {
        currentUserId.value = post.user_id;

        const { execute: getUser } = useAxios<User>({
          method: "get",
          url: "user/get/" + currentUserId.value,
        });

        getUser().then((user) => {
          posts.value.push({ user, post });
        });
      });
    }
  });
  posts.value = posts.value.sort((a, b) => {
    return (
      new Date(a.post.created_at).getTime() -
      new Date(b.post.created_at).getTime()
    );
  });
};

const { execute: getWall } = useAxios<ProjectWall>({
  method: "get",
  url: "project-wall/get-by-project/" + props.project.id,
});

const {
  execute: createPost,
  isLoading,
  error,
  isError,
} = useAxios<ProjectWall>({
  method: "post",
  url: "project-wall/create",
});

const submitPost = handleSubmit(async (values) => {
  console.log(values);
  // values would contain the validated form data
  try {
    createPost({
      project_id: props.project.id,
      user_id: userStore.getData()?.id ?? "",
      content: values.post, // Using the validated value from the form
    }).then(async () => {
      useToast().success(`Post succesfully made.`, {
        position: "top",
      });
      newPost.value.value = ""; // Clear the textarea after successful post creation
      await fetchWall(); // Refetch posts
      emitter.emit("dialogClose");
    });
  } catch (error) {
    console.log(error);
    useToast().error("Failed to create post. Please try again.", {
      position: "top",
    });
  }
});
</script>

<template>
  <Alert
    v-if="isError"
    :message="error.message.error"
    type="error"
    class="mb-5"
  />
  <div class="w-75 flex-column" style="margin-left: auto; margin-right: auto">
    <div class="w-66 flex space-y-8">
      <Section
        title="Project wall."
        icon="mdi-view-dashboard-variant"
        description="Here are all the posts for this project."
      >
      </Section>
    </div>
    <div class="mt-4">
      <div class="mt-4">
        <div
          v-for="(item, index) in posts"
          :key="index"
          class="bg-white p-4 rounded-lg shadow mb-4"
        >
          <div class="flex justify-between items-center mb-2">
            <div>
              <h5 class="font-bold">
                {{ item.user.first_name }} {{ item.user.last_name }}
              </h5>
              <p class="text-sm text-gray-500">@{{ item.user.username }}</p>
            </div>
            <p class="text-sm text-gray-400">
              {{ new Date(item.post.created_at).toLocaleString() }}
            </p>
          </div>
          <p class="text-gray-700">{{ item.post.content }}</p>
        </div>
      </div>
    </div>
    <form fast-fail @submit.prevent="submitPost" class="pt-2">
      <v-textarea
        v-model="newPost.value.value"
        label="Write your post"
        variant="outlined"
        density="compact"
        no-resize
        class="w-full mb-4"
      ></v-textarea>
      <div class="flex justify-end">
        <v-btn
          class="w-2/5"
          type="submit"
          prepend-icon="mdi-send"
          variant="flat"
          color="#5865f2"
        >
          Post
        </v-btn>
      </div>
    </form>
    <div v-if="isLoading" class="mt-2 flex justify-center">
      <Loader />
    </div>
  </div>
</template>
