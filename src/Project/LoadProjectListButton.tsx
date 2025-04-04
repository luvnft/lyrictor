import {
  ActionButton,
  AlertDialog,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  View,
} from "@adobe/react-spectrum";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAIImageGeneratorStore } from "../Editor/Image/AI/store";
import DeleteProjectButton from "./DeleteProjectButton";
import ProjectList from "./ProjectList";
import { loadProjects, useProjectStore } from "./store";
import { Project, ProjectDetail } from "./types";

export default function LoadProjectListButton({
  hideButton = false,
}: {
  hideButton?: boolean;
}) {
  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone();

  const setExistingProjects = useProjectStore(
    (state) => state.setExistingProjects
  );
  const setEditingProject = useProjectStore((state) => state.setEditingProject);
  const setIsPopupOpen = useProjectStore((state) => state.setIsPopupOpen);
  const isLoadProjectPopupOpen = useProjectStore(
    (state) => state.isLoadProjectPopupOpen
  );
  const setIsLoadProjectPopupOpen = useProjectStore(
    (state) => state.setIsLoadProjectPopupOpen
  );
  const setLyricTexts = useProjectStore((state) => state.updateLyricTexts);
  const setLyricReference = useProjectStore((state) => state.setLyricReference);
  const setUnsavedLyricReference = useProjectStore(
    (state) => state.setUnsavedLyricReference
  );
  const setImages = useProjectStore((state) => state.setImages);
  const setPromptLog = useAIImageGeneratorStore((state) => state.setPromptLog);
  const setGeneratedImageLog = useAIImageGeneratorStore(
    (state) => state.setGeneratedImageLog
  );
  const resetImageStore = useAIImageGeneratorStore((state) => state.reset);

  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [attemptToLoadFailed, setAttemptToLoadFailed] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await loadProjects();
      setExistingProjects(projects);
    };

    if (isLoadProjectPopupOpen) {
      fetchProjects();
    }
  }, [isLoadProjectPopupOpen]);

  return (
    <DialogTrigger
      onOpenChange={(isOpen) => {
        setIsPopupOpen(isOpen);
        setIsLoadProjectPopupOpen(isOpen);

        if (!isOpen) {
          setSelectedProject(undefined);
          setAttemptToLoadFailed(false);
          acceptedFiles.pop();
        }
      }}
      isOpen={isLoadProjectPopupOpen}
    >
      {!hideButton ? (
        <ActionButton
          onPress={async () => {
            const projects = await loadProjects();
            setExistingProjects(projects);
          }}
        >
          Load
        </ActionButton>
      ) : (
        <></>
      )}
      {(close) => (
        <Dialog>
          <Heading>Load previous project</Heading>
          <Divider />
          <Content height={"size-4600"}>
            <View>
              <View>
                <ProjectList
                  onSelectionChange={(project?: Project) => {
                    setSelectedProject(project);
                  }}
                />
              </View>
              {selectedProject && selectedProject.projectDetail.isLocalUrl ? (
                <View marginTop={15}>
                  <div
                    {...getRootProps({ className: "dropzone" })}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      {...getInputProps()}
                      type={"file"}
                      accept="audio/*"
                    />{" "}
                    <View
                      backgroundColor={"gray-200"}
                      padding={5}
                      borderRadius={"regular"}
                    >
                      {selectedProject &&
                      selectedProject.projectDetail.isLocalUrl ? (
                        <p>
                          Drag 'n' drop{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {selectedProject.projectDetail.audioFileName}
                          </span>
                          , or click to select it
                        </p>
                      ) : null}
                      {acceptedFiles[0] ? (
                        <h4 style={{ marginTop: 5 }}>
                          <span style={{ fontWeight: 600 }}>Loaded: </span>
                          <span>{acceptedFiles[0]?.name}</span>
                        </h4>
                      ) : null}
                    </View>
                  </div>{" "}
                </View>
              ) : null}
            </View>
          </Content>
          <ButtonGroup>
            {selectedProject ? (
              <DeleteProjectButton
                project={selectedProject}
                onProjectDelete={async () => {
                  const projects = await loadProjects();
                  setExistingProjects(projects);
                  setSelectedProject(undefined);
                }}
              />
            ) : null}
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <DialogTrigger isOpen={attemptToLoadFailed}>
              <Button
                variant="cta"
                onPress={() => {
                  if (selectedProject) {
                    console.log(selectedProject);
                    // TODO: double check
                    resetImageStore();
                    let projectDetail: ProjectDetail | undefined;

                    if (
                      selectedProject.projectDetail.isLocalUrl &&
                      acceptedFiles[0]?.name ===
                        selectedProject.projectDetail.audioFileName
                    ) {
                      projectDetail = {
                        ...selectedProject.projectDetail,
                        audioFileUrl: URL.createObjectURL(acceptedFiles[0]),
                      };
                    } else if (!selectedProject.projectDetail.isLocalUrl) {
                      projectDetail = {
                        ...selectedProject.projectDetail,
                      };
                    }

                    if (projectDetail) {
                      setEditingProject(projectDetail);
                      setLyricTexts(selectedProject.lyricTexts);
                      setPromptLog(
                        selectedProject.promptLog !== undefined
                          ? selectedProject.promptLog
                          : []
                      );
                      setGeneratedImageLog(
                        selectedProject.generatedImageLog !== undefined
                          ? selectedProject.generatedImageLog
                          : []
                      );

                      if (selectedProject.lyricReference) {
                        setLyricReference(selectedProject.lyricReference);
                        setUnsavedLyricReference(
                          selectedProject.lyricReference
                        );
                      } else {
                        setLyricReference("");
                        console.log("no lyricreference");
                      }

                      if (selectedProject.images) {
                        setImages(selectedProject.images);
                      } else {
                        setImages([]);
                      }

                      close();
                    } else {
                      setAttemptToLoadFailed(true);
                    }
                  } else {
                    setAttemptToLoadFailed(true);
                  }
                }}
              >
                Load
              </Button>
              <AlertDialog
                variant="error"
                title="Failed to load"
                primaryActionLabel="Close"
                onCancel={() => {
                  setAttemptToLoadFailed(false);
                }}
                onPrimaryAction={() => {
                  setAttemptToLoadFailed(false);
                }}
              >
                Make sure you load the exact audio file that was used to create
                this project.
              </AlertDialog>
            </DialogTrigger>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}
