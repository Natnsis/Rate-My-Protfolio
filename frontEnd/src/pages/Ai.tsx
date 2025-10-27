import { useState } from "react";
import axios from "axios";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const Ai = () => {
  const [link, setLink] = useState("");
  const [responseType, setResponseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!link) {
      setError("Please enter a portfolio link!");
      return;
    }
    if (!responseType) {
      alert("Please select a response type!");
      return;
    }

    setLoading(true);
    setReply("");
    setError("");

    try {
      const { data } = await axios.post(
        "https://rate-my-protfolio-1.onrender.com/api/v1/ai",
        { link, type: responseType },
        { headers: { "Content-Type": "application/json" } }
      );

      setReply(data.reply || "No response from AI.");
    } catch (err: any) {
      console.error("AI request failed:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-col bg-background text-foreground">
      {/* Page Header */}
      <div className="sticky top-0 z-10 bg-background p-5 border-b border-border">
        <Heading page="ai" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-5 overflow-hidden gap-4">
          {/* Output */}
          <div className="flex-1 overflow-auto p-4 border border-border rounded-lg bg-muted dark:bg-muted/20 flex flex-col items-center justify-center">
            {!reply ? (
              <div className="flex justify-center items-center gap-3 text-center">
                <img src="/ai.png" alt="ai-img" className="h-40 w-30 rounded" />
                <div>
                  <h1 className="text-2xl font-bbh">RMP AI</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm w-[40vw]">
                    I'm brought you here by a free ai api so don't blame if it
                    took me about 30 secs to respond 😆(i promise ill reply).
                    Paste a portfolio link below and let's have some fun!
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 dark:text-gray-100 text-base whitespace-pre-wrap">
                {reply}
              </p>
            )}

            {loading && !reply && (
              <div className="mt-5">
                <Spinner />
              </div>
            )}
          </div>

          {/* Input area — sticky bottom */}
          <div className="flex gap-3 items-center mt-2">
            <Input
              placeholder="www.portfolio-link.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="flex-1"
            />

            <Select onValueChange={(val) => setResponseType(val)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Response types</SelectLabel>
                  <SelectItem value="roast">Roast 😂</SelectItem>
                  <SelectItem value="rating">Rating ⭐</SelectItem>
                  <SelectItem value="review">Review 👍</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Generating..." : "Submit"}
            </Button>
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
          )}
        </main>
      </div>
    </section>
  );
};

export default Ai;
