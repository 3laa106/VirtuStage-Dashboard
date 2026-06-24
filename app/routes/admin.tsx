import { useState, useEffect } from "react";
import {
  Activity,
  Clapperboard,
  Search,
  Settings,
  UsersRound,
} from "lucide-react";
import { PageLayout } from "../components/PageLayout";
import { Card } from "../components/Card";
import { AdminRoute } from "../components/AdminRoute";
import {
  getAdminPanelData,
  updateManagedUser,
  updateScenario,
} from "../services/adminService";

import { styles } from "../utils/styles";
import { SectionHeader } from "../components/SectionHeader";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

import { UserTableRow } from "../components/UserTableRow";
import { ActivityItem } from "../components/ActivityItem";
import { ScenarioToggleRow } from "../components/ScenarioToggleRow";
import type {
  ManagedUser,
  PlatformActivity,
  TrainingScenario,
} from "../types/admin";
import { getApiErrorMessage } from "../utils/apiError";
import { EmptyState } from "../components/EmptyState";

export default function UserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [activities, setActivities] = useState<PlatformActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<TrainingScenario[]>([]);

  const fetchAdminPanelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminPanelData();
      setUsers(data.users);
      setActivities(data.activities);
      setScenarios(data.scenarios);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load admin dashboard data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPanelData();
  }, []);

  const managedUsers = users.filter((user) => user.role === "user");

  const filtered = managedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleDisable = async (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    try {
      await updateManagedUser(id, { disabled: !target.disabled });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, disabled: !u.disabled } : u)),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update the user."));
    }
    setOpenMenu(null);
  };

  const toggleScenario = async (id: string) => {
    const target = scenarios.find((scenario) => scenario.id === id);
    if (!target) return;
    try {
      await updateScenario(id, !target.enabled);
      setScenarios((prev) =>
        prev.map((scenario) =>
          scenario.id === id
            ? { ...scenario, enabled: !scenario.enabled }
            : scenario,
        ),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update the scenario."));
    }
  };

  return (
    <AdminRoute>
      <PageLayout>
        <SectionHeader
          title="User Management"
          subtitle="Manage users and monitor system activity"
        />

        {loading && <LoadingSpinner text="Loading admin data..." />}
        {error && (
          <ErrorMessage message={error} onRetry={fetchAdminPanelData} />
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Management Table */}
            <Card className="lg:col-span-2" title="All Users">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c6484]" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${styles.inputBase} ${styles.inputWithIcon}`}
                />
              </div>

              {/* Table */}
              {filtered.length === 0 ? (
                <EmptyState
                  compact
                  icon={UsersRound}
                  title={search ? "No matching users" : "No users yet"}
                  description={
                    search
                      ? `No platform users match "${search}".`
                      : "Registered platform users will appear here."
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={styles.tableHeaderGroup}>
                        <th className="text-left pb-3 font-bold">User</th>
                        <th className="text-left pb-3 font-bold">Sessions</th>
                        <th className="text-left pb-3 font-bold">
                          Last Active
                        </th>
                        <th className="text-left pb-3 font-bold">Role</th>
                        <th className="text-left pb-3 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#272b3a]">
                      {filtered.map((user) => (
                        <UserTableRow
                          key={user.id}
                          user={user}
                          openMenu={openMenu}
                          onToggleMenu={setOpenMenu}
                          onDisable={toggleDisable}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="text-[#5c6484] text-xs mt-4">
                Showing {filtered.length} of {managedUsers.length} users
              </p>
            </Card>

            {/* Right Column */}
            <div className="space-y-6 lg:col-span-1">
              {/* System Activity */}
              <Card title="System Activity">
                {activities.length === 0 ? (
                  <EmptyState
                    compact
                    icon={Activity}
                    title="No platform activity"
                    description="Recent platform events will appear here."
                  />
                ) : (
                  <div className="space-y-4">
                    {activities.map((item) => (
                      <ActivityItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </Card>

              {/* Scenario Management */}
              <Card
                title="Scenario Management"
                action={<Settings className="w-5 h-5 text-[#9aa1bc]" />}
              >
                {scenarios.length === 0 ? (
                  <EmptyState
                    compact
                    icon={Clapperboard}
                    title="No training scenarios"
                    description="Available training scenarios will appear here."
                  />
                ) : (
                  <div className="space-y-4">
                    {scenarios.map((s) => (
                      <ScenarioToggleRow
                        key={s.id}
                        scenario={s}
                        onToggle={toggleScenario}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </PageLayout>
    </AdminRoute>
  );
}
