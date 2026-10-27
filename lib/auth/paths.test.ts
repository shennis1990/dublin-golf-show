import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isAdminPath,
  isAuthPath,
  isProtectedAdminPath,
  isPublicAdminPath,
  safeAdminNextPath,
} from "./paths.ts";

test("treats /admin and nested admin routes as admin paths", () => {
  assert.equal(isAdminPath("/admin"), true);
  assert.equal(isAdminPath("/admin/login"), true);
  assert.equal(isAdminPath("/about-the-event-organiser"), false);
});

test("keeps the login route public", () => {
  assert.equal(isPublicAdminPath("/admin/login"), true);
  assert.equal(isProtectedAdminPath("/admin"), true);
  assert.equal(isProtectedAdminPath("/admin/login"), false);
});

test("recognises auth callback paths", () => {
  assert.equal(isAuthPath("/auth/callback"), true);
  assert.equal(isAuthPath("/admin"), false);
});

test("rejects open redirects in next=", () => {
  assert.equal(safeAdminNextPath(null), "/admin");
  assert.equal(safeAdminNextPath("/admin/login"), "/admin/login");
  assert.equal(safeAdminNextPath("https://evil.example"), "/admin");
  assert.equal(safeAdminNextPath("//evil.example"), "/admin");
  assert.equal(safeAdminNextPath("/terms"), "/admin");
});
