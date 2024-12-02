<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { onMount } from "svelte";
  import { supabase, supabaseAdmin } from "$lib/supabaseClient";

  let users: Array<{
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    department_id?: string;
    department_name?: string;
    profile_pic: string | null;
    is_verified: boolean;
  }> = [];

  let departments: Array<{ id: string; name: string }> = [];
  let selectedUser: (typeof users)[0] | null = null;
  let selectedDepartmentId: string | null = null;
  let selectedRole: string = "";
  let showAlert = false;
  let saving = false;
  let loading = true;
  let approvingUserId: string | null = null; // Tracks the user being approved
  let deletingUserId: string | null = null; // Tracks the user being deleted

  // Fetch users and departments
  onMount(async () => {
    await fetchDepartments();
    await fetchUsers();
    loading = false;
  });

  async function fetchDepartments() {
    const { data: deptData, error } = await supabase
      .from("departments")
      .select("id, name");

    if (error) {
      console.error("Error fetching departments:", error.message);
    } else {
      departments = deptData || [];
    }
  }

  async function fetchUsers() {
    const { data: userData, error } = await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, email, role, department_id, profile_pic, is_verified"
      );

    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      users = (userData || []).map((user) => ({
        ...user,
        department_name:
          departments.find((dept) => dept.id === user.department_id)?.name ||
          "N/A",
      }));
    }
  }

  const editUser = (user: (typeof users)[0]) => {
    selectedUser = { ...user };
    selectedDepartmentId = user.department_id || null;
    selectedRole = user.role || "";
  };

  const saveProfile = async () => {
    if (selectedUser) {
      if (
        !selectedRole ||
        (selectedRole !== "admin" && !selectedDepartmentId)
      ) {
        showAlert = true;
        return;
      }

      saving = true;
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          department_id: selectedRole !== "admin" ? selectedDepartmentId : null,
          role: selectedRole,
        })
        .eq("id", selectedUser.id);

      if (error) {
        console.error("Error updating profile:", error.message);
      } else {
        const updatedUserIndex = users.findIndex(
          (user) => user.id === selectedUser?.id
        );
        if (updatedUserIndex >= 0) {
          users[updatedUserIndex] = {
            ...users[updatedUserIndex],
            first_name: selectedUser.first_name,
            last_name: selectedUser.last_name,
            department_id: selectedDepartmentId || undefined,
            role: selectedRole,
          };
        }
        alert("Profile updated successfully!");
        selectedUser = null;
      }
      saving = false;
      showAlert = false;
    }
  };

  const approveUser = async (userId: string) => {
    approvingUserId = userId; // Start spinner for this user
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", userId);

      if (error) {
        console.error("Error approving user:", error.message);
        alert("Failed to approve user.");
      } else {
        alert("User approved successfully!");
        // Update the user list to reflect the changes
        users = users.map((user) =>
          user.id === userId ? { ...user, is_verified: true } : user
        );
      }
    } catch (err) {
      console.error("Error approving user:", err);
      alert("An unexpected error occurred.");
    } finally {
      approvingUserId = null; // Stop spinner
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete the user from Supabase Authentication
      const { error: authError } =
        await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authError) {
        console.error(
          "Error deleting user from authentication:",
          authError.message
        );
        return { success: false, message: "Failed to delete user." };
      }

      // Delete the user from the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        console.error("Error deleting user profile:", profileError.message);
        return { success: false, message: "Failed to delete profile." };
      }

      return { success: true, message: "User deleted successfully!" };
    } catch (err) {
      console.error("Error deleting user:", err);
      return { success: false, message: "An unexpected error occurred." };
    }
  };
</script>

<div class="min-h-screen bg-base-300 p-8">
  <h1 class="text-2xl font-bold mb-4">User List</h1>

  <div class="overflow-x-auto">
    <table class="table w-full shadow-lg rounded-lg">
      <thead>
        <tr>
          <th>Profile</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Department</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user}
          <tr class="hover:bg-gray-800">
            <td>
              {#if user.profile_pic}
                <img
                  src={user.profile_pic}
                  alt="Profile"
                  class="w-10 h-10 rounded-full"
                />
              {:else}
                <div
                  class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500"
                >
                  N/A
                </div>
              {/if}
            </td>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.department_name}</td>
            <td>
              {#if user.is_verified}
                <span class="text-green-500 font-medium">Verified</span>
              {:else}
                <span class="text-red-500 font-medium">Not Verified</span>
              {/if}
            </td>
            <td>
              <button
                class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                on:click={() => editUser(user)}
              >
                Edit
              </button>
              {#if !user.is_verified}
                <button
                  class="btn btn-sm bg-green-600 hover:bg-green-700 text-white font-medium {approvingUserId ===
                  user.id
                    ? 'loading'
                    : ''}"
                  on:click={() => approveUser(user.id)}
                  disabled={approvingUserId === user.id}
                >
                  {#if approvingUserId === user.id}
                    Approving...
                  {:else}
                    Approve
                  {/if}
                </button>
              {/if}
              <button
                class="btn btn-sm bg-red-600 hover:bg-red-700 text-white font-medium {deletingUserId ===
                user.id
                  ? 'loading'
                  : ''}"
                on:click={() => deleteUser(user.id)}
                disabled={deletingUserId === user.id}
              >
                {#if deletingUserId === user.id}
                  Deleting...
                {:else}
                  Delete
                {/if}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Modal for editing a user -->
  <!-- Modal for editing a user -->
  {#if selectedUser}
    <div class="modal modal-open">
      <div class="modal-box bg-base-200">
        <h3 class="font-bold text-lg">Edit User</h3>
        <div class="py-4">
          <label for="first_name" class="label text-white">First Name</label>
          <input
            id="first_name"
            type="text"
            class="input input-bordered w-full"
            bind:value={selectedUser.first_name}
          />

          <label for="last_name" class="label text-white">Last Name</label>
          <input
            id="last_name"
            type="text"
            class="input input-bordered w-full"
            bind:value={selectedUser.last_name}
          />

          <label for="role" class="label text-white">Role</label>
          <select
            id="role"
            class="select select-bordered w-full"
            bind:value={selectedRole}
          >
            <option value="" disabled>Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {#if selectedRole !== "admin"}
            <label for="department" class="label text-white">Department</label>
            <select
              id="department"
              class="select select-bordered w-full"
              bind:value={selectedDepartmentId}
            >
              <option value="" disabled>Select Department</option>
              {#each departments as department}
                <option value={department.id}>{department.name}</option>
              {/each}
            </select>
          {/if}
        </div>

        <div class="modal-action">
          <button
            on:click={() => (selectedUser = null)}
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            on:click={saveProfile}
            class="btn btn-success"
            disabled={saving}
          >
            {#if saving}
              <span class="loading loading-spinner">Saving...</span>
            {:else}
              Save
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
