import { describe, it, expect, vi } from "vitest";
import pingCommand from "../src/PrefixCommands/Utility/ping.js";
import { Message, Client } from "discord.js";

describe("Ping Command", () => {
  it("should respond with latency", async () => {
    const mockEdit = vi.fn();
    const mockReply = vi.fn().mockResolvedValue({
      createdTimestamp: 10050,
      edit: mockEdit,
    });

    const mockMessage = {
      createdTimestamp: 10000,
      reply: mockReply,
    } as unknown as Message;

    const mockClient = {
      ws: { ping: 120 },
    } as unknown as Client;

    await pingCommand.execute(mockMessage, [], mockClient);

    expect(mockReply).toHaveBeenCalledWith("Calculating latency...");
    expect(mockEdit).toHaveBeenCalledTimes(1);
    expect(mockEdit.mock.calls[0][0]).toContain("Pong!");
    expect(mockEdit.mock.calls[0][0]).toContain("50ms");
    expect(mockEdit.mock.calls[0][0]).toContain("120ms");
  });
});
