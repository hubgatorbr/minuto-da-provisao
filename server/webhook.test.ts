import { describe, expect, it } from "vitest";
import express from "express";
import http from "http";
import { registerStripeWebhook } from "./webhook";

describe("Stripe Webhook e Integração", () => {
  it("processa o endpoint /api/stripe/webhook com sucesso", async () => {
    const app = express();
    registerStripeWebhook(app);

    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;

    const mockEvent = {
      id: `evt_test_${Date.now()}`,
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_12345",
          customer: "cus_test_12345",
          subscription: "sub_test_12345",
          metadata: {
            userId: "1",
            planId: "premium",
          },
        },
      },
    };

    const response = await fetch(`http://localhost:${port}/api/stripe/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockEvent),
    });

    const data = await response.json();
    server.close();

    expect(response.status).toBe(200);
    expect(data).toEqual({ received: true });
  });

  it("processa evento de cancelamento customer.subscription.deleted", async () => {
    const app = express();
    registerStripeWebhook(app);

    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;

    const mockEvent = {
      id: `evt_cancel_${Date.now()}`,
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_test_12345",
          customer: "cus_test_12345",
          metadata: {
            userId: "1",
          },
        },
      },
    };

    const response = await fetch(`http://localhost:${port}/api/stripe/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockEvent),
    });

    const data = await response.json();
    server.close();

    expect(response.status).toBe(200);
    expect(data).toEqual({ received: true });
  });
});
