import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createProject,
} from "../services/projectService";

const CreateProject = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      startDate: "",
      dueDate: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      await createProject(formData);

      navigate("/projects");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to create project"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-white p-8 shadow">

          <h1 className="text-3xl font-bold">
            Create Project
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new project in NOVA
          </p>


          {error && (
            <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            <div>
              <label className="mb-2 block font-medium">
                Project Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>


            <div>
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Project description"
                rows="5"
                className="w-full rounded-lg border p-3"
              />
            </div>


            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="PLANNING">
                    Planning
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="ON_HOLD">
                    On Hold
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>
              </div>


              <div>
                <label className="mb-2 block font-medium">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >

                  <option value="LOW">
                    Low
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>

                  <option value="URGENT">
                    Urgent
                  </option>

                </select>
              </div>

            </div>


            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>


              <div>
                <label className="mb-2 block font-medium">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Project"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default CreateProject;