import { defineStore } from "pinia";
import { ref } from "vue";
import { Project, ProjectUser } from "@/features/projects";
import { useAxios } from "@/composables/useAxios";
import { useToast } from "vue-toast-notification";
export const useProjectStore = defineStore("project", () => {
  const project = ref<Project | null>(null);
  const users = ref<ProjectUser[]>([]);

  const setProject = (proj: Project) => {
    project.value = proj;

    fetchAssignedUsers(proj.id);
  };

  const removeProject = () => {
    project.value = null;
  };

  const fetchAssignedUsers = (projectId: number) => {
    const { execute } = useAxios<ProjectUser[]>({
      method: "get",
      url: `user-project/get-project-users/${projectId}`,
    });

    execute()
      .then((res: ProjectUser[]) => {
        users.value = res;
      })
      .catch(() => {
        useToast().error("Failed to fetch project users!", { position: "top" });
      });
  };

  const getProject = () => project.value;

  const getProjectUsers = (): ProjectUser[] => users.value;

  return { setProject, removeProject, getProject, getProjectUsers };
});
