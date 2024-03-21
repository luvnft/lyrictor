import { useAIImageGeneratorStore } from "../Editor/Lyrics/Image/store";
import { useProjectStore } from "./store";
import { Project } from "./types";

export function useProjectService() {
  const editingProject = useProjectStore((state) => state.editingProject);
  const lyricTexts = useProjectStore((state) => state.lyricTexts);
  const unSavedLyricReference = useProjectStore(
    (state) => state.unSavedLyricReference
  );
  const lyricReference = useProjectStore((state) => state.lyricReference);
  const generatedImageLog = useAIImageGeneratorStore(
    (state) => state.generatedImageLog
  );
  const promptLog = useAIImageGeneratorStore((state) => state.promptLog);

  const saveProject = (suppliedProject?: Project) => {
    let project: Project | undefined;

    if (suppliedProject) {
      project = suppliedProject;
    } else if (editingProject) {
      project = {
        id: editingProject.name,
        projectDetail: editingProject,
        lyricTexts,
        lyricReference: unSavedLyricReference ?? lyricReference,
        generatedImageLog,
        promptLog,
      };
    }

    // console.log(
    //   "saving ",
    //   project,
    //   "unsavedlyricref:",
    //   unSavedLyricReference,
    //   "lyricref:",
    //   lyricReference
    // );

    if (project) {
      const existingLocalProjects = localStorage.getItem("lyrictorProjects");

      let existingProjects: Project[] | undefined = undefined;

      if (existingLocalProjects) {
        existingProjects = JSON.parse(existingLocalProjects) as Project[];
      }

      if (existingProjects) {
        let newProjects = existingProjects;
        const duplicateProjectIndex = newProjects.findIndex(
          (savedProject: Project) =>
            project?.projectDetail.name === savedProject.projectDetail.name
        );

        if (duplicateProjectIndex !== undefined && duplicateProjectIndex >= 0) {
          newProjects[duplicateProjectIndex] = project;
        } else {
          newProjects.push(project);
        }

        localStorage.setItem("lyrictorProjects", JSON.stringify(newProjects));

        console.log("lyrictorProjects", newProjects);
      } else {
        localStorage.setItem("lyrictorProjects", JSON.stringify([project]));
        console.log("lyrictorProjects", project);
      }
    }
  };

  return [saveProject] as const;
}
