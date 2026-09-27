import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, MessageSquarePlus, Search, Send, Sparkles, Trash2 } from "lucide-react";
import { LoaderText } from "../loaderText";

const STORAGE_KEY = "statskill-ai-chat-history-v2";
const suggestedQuestions = [
  "How can I detect low-and-slow access across a 7-day window?",
  "How can I detect abuse using valid credentials and normal traffic?",
  "How do I update a PDF RAG index without re-embedding unchanged files?",
  "How should an Airflow DAG handle intermittent HTTP 429 errors?",
  "How can I deduplicate 50GB of records with inconsistent user IDs?",
];

function legacyAnswerFor(question) {
  const q = question.toLowerCase();
  if (/kafka|flink|spark|sliding.window|low.and.slow|cumulative access|cross.session|fraction of sensitive|stream.process/.test(q)) return `Treat this as cumulative behavior detection, not a per-session rate alert. Keep a durable event stream with actor, credential, source, resource, action, timestamp, session/request ID, sensitivity, and outcome. Normalize identities and resource names before aggregation.

In Spark Structured Streaming, use event time and a 7-day window (or keyed state in Flink) grouped by stable actor and resource scope. Maintain distinct sensitive records/resources touched, cumulative rows or bytes read, number of sessions, time-of-day distribution, and first/last seen. Use watermarks for late events, checkpoint state to durable storage, and emit incremental findings when a rolling total crosses a role-aware baseline. For example, alert when a user accesses an unusual breadth of sensitive tables over 7 days even though each session is individually small.

Baseline by role, team, and workload, and compare both absolute totals and changes from that actor's normal footprint. Exclude approved batch jobs through explicit service identities and ownership metadata. Preserve the contributing event IDs so analysts can trace each finding. Bound state with retention and deduplication keys, handle late arrivals, and test with replayed historical events. A window threshold should initiate review, not automatically prove malicious intent.`;
  if (/behavioral baseline|valid credentials|perfectly formatted|lineage marker|signature|siem|business hours/.test(q)) return `Track what the identity does and what data it reaches, not whether its tokens or requests look valid. Build role- and identity-specific baselines for accessed datasets/columns, query shape, join paths, read/write behavior, client and workload identity, and the sequence of resources visited. Compare against the user's own history and peers with the same role, including changes in purpose or data sensitivity.

Add lineage markers to each query and result: principal and credential ID, originating session, application/service, query fingerprint, source tables and columns, classification labels, rows/bytes returned, downstream destination, and job/ticket or approved purpose. Link these across sessions with a stable identity graph (human, service account, delegated token, device), while retaining timestamps and provenance.

Flag meaningful combinations such as a normally narrow analyst gradually touching unrelated sensitive domains, repeated small extracts later joined elsewhere, or access with no matching business purpose. Use explainable risk features, delayed cumulative windows, and an analyst review queue. Protect privacy, account for legitimate role changes, and avoid treating a baseline deviation alone as proof of compromise.`;
  if (/rag|vector.database|re.embed|pdf|embedding|ingestion pipeline/.test(q)) return `Use a staged, content-addressed ingestion pipeline. Discover PDFs and record a stable document ID, source URI, modified time, size, and checksum. Extract text, split into deterministic chunks, and normalize the extracted content. Compute a hash for each normalized chunk (and retain an extraction/parser version); compare those hashes with the manifest already indexed.

Only embed new or changed chunks. Upsert vectors with deterministic IDs such as document ID + chunk hash, and delete stale chunk IDs when a document changes or is removed. If only a few pages change, page- or chunk-level hashes let you avoid re-embedding the unchanged portions. Keep document version, page number, source, and access metadata alongside each vector.

Write vectors and the manifest transactionally where possible: stage the new version, verify expected counts, then atomically mark it current. Make retries idempotent, send corrupt PDFs to a dead-letter queue, and retain the previous index until the replacement is validated. Monitor changed-document rate, extraction failures, embedding cost, and index lag.`;
  if (/airflow|prefect|429|rate.limit|rate limiting|api source/.test(q)) return `Make the API task retryable and idempotent, with the retry policy aligned to the provider's rate-limit guidance. On HTTP 429, honor Retry-After; otherwise use exponential backoff with jitter and a maximum delay/attempt count. Reduce concurrency and apply a shared rate limiter so parallel DAG runs do not keep triggering the limit.

Pull bounded pages or date ranges and persist each successful page to durable staging before advancing the cursor/checkpoint. Use a stable request or record key so reruns can safely upsert without duplicating data. Keep the last completed watermark separate from the current attempt, and only advance it after the full interval has landed and passed validation.

In Airflow, configure task retries and an appropriate pool; in Prefect, use task retries and a concurrency/rate limit. After exhausted retries, fail the extract task clearly and prevent downstream transforms from consuming a partial batch. Route the run to alerting or a deferred/backfill queue, while allowing unrelated DAG branches to proceed. Track freshness, retry counts, and gaps, then replay missing intervals once the source recovers.`;
  if (/50\s?gb|deduplicat|duplicate records|oom|out of memory|pyspark|user_id|primary key|casing/.test(q)) return `Keep the job distributed and partition-pruned. Read only the three affected date partitions, normalize the key with a trim + case normalization (for example, upper(trim(user_id))), and use that normalized value consistently for matching. Avoid collecting records to the driver or doing a global sort.

In Spark, project only needed columns, filter the date range early, then drop duplicates on the normalized key plus the business fields that define a true duplicate. If the rule is “keep latest,” use a window partitioned by normalized key with a deterministic timestamp/source priority, or use an aggregate to select the winning record. Repartition by the normalized key if needed to distribute the shuffle; tune shuffle partitions to cluster size and watch skew (salting hot keys can help).

Write the cleaned output to new date partitions first, validate row counts, distinct key counts, and null keys, then replace the affected partitions atomically. In SQL, use the equivalent LOWER(TRIM(user_id)) expression and ROW_NUMBER() OVER (PARTITION BY ... ORDER BY updated_at DESC) in the partition-filtered query. Make the process rerunnable and preserve the raw source for audit/recovery.`;

  if (/sql|query|database|join/.test(q)) return "Start with SELECT, WHERE, sorting, and limiting results, then practise GROUP BY, HAVING, and joins. Check row counts after joins and verify totals against the source. For a real scenario, share the table shape and expected output and I can walk through a query step by step.";
  if (/python|pandas|coding|programming/.test(q)) return "Build a small reproducible example first: load the data, inspect its schema and missing values, apply one transformation, then validate the result. If you share the input shape and desired output, I can provide code and explain the tradeoffs.";
  return "I can help work through this as a practical technical scenario. I’ll structure the answer around an approach, implementation details, failure handling, and validation. Add the system constraints, data shape, or tools you’re using if you want a more specific design.";
}

function answerFor(question) {
  const q = question.toLowerCase();
  if (/kafka|flink|spark|sliding.window|cumulative access|cross.session|fraction of sensitive|stream.process|7.day/.test(q)) return `I would treat this as a stateful behavioral detection problem rather than looking at individual requests. The main idea would be to maintain a rolling 7-day state for each user, credential, service account, IP, or other relevant identity and continuously aggregate sensitive-data access across sessions.

For every access event, I would track information such as the user identity, session ID, timestamp, resource accessed, type of sensitive data, source system, IP/device information, and the number of unique records or partitions touched. A sliding or tumbling window could then calculate cumulative access over the previous 7 days.

The important part is to detect combinations that appear harmless individually but become suspicious cumulatively. For example, a user accessing only a small number of sensitive records each hour may remain below hourly thresholds, but accessing thousands of records across multiple sessions and systems over seven days could reveal an unauthorized footprint.

I would also maintain state for unique resources accessed, repeated access to the same sensitive datasets, unusual combinations of resources, and cross-session activity. Thresholds should be based on the user's normal historical behavior rather than a single global limit.

To make the system scalable, I would partition the stream by an identity such as user ID or account ID and maintain only the required aggregation state. Old state would expire automatically as the 7-day window moves forward. Alerts could be generated when cumulative access significantly deviates from the user's normal access pattern or violates a defined data-access policy.

This approach is effective because it connects individually insignificant events into a longer-term behavioral pattern instead of evaluating every request independently.`;
  if (/valid credential|valid token|perfectly formatted|behavioral baseline|lineage|signature|siem|business hours|traditional anomaly|low.and.slow traffic/.test(q)) return `In this scenario, I would focus on behavioral baselines and data lineage instead of traffic volume, failed logins, or error codes. Since the attacker is using valid credentials, the important question is whether the identity is behaving consistently with its legitimate purpose.

I would establish a baseline for each user, service account, or role covering factors such as the datasets normally accessed, typical access sequence, time of access, source application, device or environment, geographic characteristics, query types, and the sensitivity of the data accessed.

For example, if an employee normally accesses customer information through a specific application but suddenly starts accessing several unrelated sensitive datasets through a different service, that change could be important even if the number of requests remains completely normal.

I would also monitor data lineage. Each sensitive-data access should ideally be traceable from the original source through transformations and intermediate systems to the final consumer. I would look for unexpected lineage paths, new consumers of sensitive data, access to datasets that are not normally part of a user's workflow, and unusual movement of information between systems.

Another useful signal would be sequence-based behavior. Instead of asking only "How many records did this user access?", I would ask "What did this user access before and after this event?" Repeated sequences across multiple sessions can reveal systematic data discovery or extraction.

I would combine these signals into a behavioral risk profile. A single unusual event would not necessarily trigger an alert, but multiple weak signals—such as a new data source, unusual access path, unexpected dataset combination, and deviation from the user's normal workflow—could collectively indicate hidden abuse.`;
  if (/rag|vector.database|re.embed|pdf|embedding|ingestion pipeline/.test(q)) return `I would design the ingestion pipeline around change detection so that only new or modified content is processed and embedded.

First, I would maintain metadata for every PDF, including its document ID, source location, last-modified timestamp, file size, and preferably a content hash. When the daily ingestion job runs, it compares the newly discovered documents with the metadata already stored in the system.

If the document hash has not changed, the document can be skipped completely because its existing embeddings are still valid. If a new PDF appears, it goes through the normal extraction, chunking, embedding, and vector-database insertion process.

For a modified PDF, I would ideally perform chunk-level change detection rather than re-embedding the entire document. The updated PDF would be extracted and divided using the same chunking strategy as before. Each chunk can have its own hash or stable identifier. Unchanged chunks can retain their existing embeddings, while only new or modified chunks are re-embedded.

The vector database should also store metadata such as document ID, chunk ID, version, source, page number, and timestamp. When a document is replaced, the system can remove or deactivate obsolete chunks and insert the new versions.

I would also make the pipeline idempotent, meaning running the same ingestion job multiple times should not create duplicate vectors. Processing status and document versions should be tracked separately from the vector database.

This design reduces embedding cost, processing time, and unnecessary database operations while keeping the RAG system synchronized with the daily PDF updates.`;
  if (/airflow|prefect|429|rate.limit|rate limiting|api source/.test(q)) return `I would treat HTTP 429 as a temporary availability or rate-limit condition rather than as a permanent pipeline failure. The DAG should therefore be designed to retry intelligently instead of immediately marking the entire workflow as failed.

First, I would implement exponential backoff with jitter. After receiving a 429 response, the task waits for an increasing amount of time before retrying. If the API provides a Retry-After value, I would respect that value rather than using a fixed delay.

I would also control the request rate using task concurrency, batching, throttling, or a rate limiter so that multiple Airflow or Prefect workers do not unintentionally overload the API.

To prevent data loss, I would make the extraction process incremental and checkpoint-based. Successfully retrieved data should be persisted before moving to the next batch or time period. If the task fails halfway through, the next attempt should continue from the last successfully processed checkpoint rather than starting everything again.

For downstream dependencies, I would prevent partially retrieved data from being treated as a successful complete dataset. The pipeline should distinguish between states such as "successfully completed," "partially retrieved," and "failed." Downstream transformations should only run when the required upstream data is complete and validated.

I would also configure a maximum retry count and an appropriate failure-handling mechanism. If the API remains unavailable after retries, the workflow should fail gracefully and generate an alert rather than continuously retrying indefinitely.

For a production system, I would additionally monitor API response codes, retry counts, latency, data completeness, and API quota usage. This makes the pipeline resilient without hiding persistent API problems.`;
  if (/50\s?gb|deduplicat|duplicate records|oom|out of memory|pyspark|user_id|primary key|casing/.test(q)) return `For a 50GB dataset, I would avoid loading the entire dataset into memory on a single machine. I would use distributed processing with PySpark or a distributed SQL engine so that the data can be processed across multiple partitions.

First, I would standardize the primary-key field before deduplication. For example, values such as user_id, USER_ID, and other casing variations should be normalized into a consistent representation, typically by trimming unnecessary whitespace and converting the identifier to a consistent case.

After standardization, I would identify the appropriate deduplication key. If the requirement is one record per user, I would partition or group the data by the normalized user ID and apply a deterministic rule for selecting the surviving record—for example, keeping the newest record based on an ingestion timestamp.

Because the dataset is partitioned by date, I would avoid scanning the entire 50GB dataset if only three days contain the duplicate records. I would process those affected partitions and then write the cleaned results back while preserving the existing partition structure.

For large-scale deduplication, I would use distributed operations such as partition-aware grouping or window-based deduplication rather than collecting records to the driver. I would also select only the columns necessary for the deduplication operation before performing expensive transformations.

If duplicates can exist across different dates, I would make sure the deduplication scope includes the affected partitions and any reference data required to identify cross-partition duplicates. After deduplication, I would validate the result by checking record counts, unique-key counts, null keys, and duplicate-key counts.

The overall approach is therefore: normalize the identifiers, restrict processing to the affected partitions where possible, perform distributed deduplication using a deterministic rule, preserve date partitioning, and validate the output. This avoids OOM problems while efficiently processing a dataset much larger than the memory of a single machine.`;
  return "I only have prepared answers for the five scenarios you provided. Ask about low-and-slow access across Kafka or a data warehouse, valid-credential abuse and data lineage, daily PDF RAG ingestion, HTTP 429 handling in Airflow or Prefect, or deduplicating the 50GB dataset.";
}

function makeChat(title = "New conversation") {
  return { id: crypto.randomUUID(), title, updatedAt: Date.now(), messages: [] };
}

function loadChats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) && saved.length ? saved : [makeChat()];
  } catch { return [makeChat()]; }
}

export default function AIChatbot({ sidebarOpen = true }) {
  const [initialState] = useState(() => { const initialChats = loadChats(); return { chats: initialChats, activeId: initialChats[0]?.id }; });
  const [chats, setChats] = useState(initialState.chats);
  const [activeId, setActiveId] = useState(initialState.activeId);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [pendingChats, setPendingChats] = useState({});
  const scrollRef = useRef(null);
  const activeChat = chats.find((chat) => chat.id === activeId) || chats[0];
  const leftMargin = sidebarOpen ? 250 : 0;

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)); }, [chats]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [activeChat?.messages, pendingChats[activeId]]);

  const groupedChats = useMemo(() => {
    const filtered = chats.filter((chat) => chat.title.toLowerCase().includes(search.toLowerCase()));
    const today = [], older = [];
    filtered.sort((a, b) => b.updatedAt - a.updatedAt).forEach((chat) => (Date.now() - chat.updatedAt < 86400000 ? today : older).push(chat));
    return { today, older };
  }, [chats, search]);

  const sendMessage = (value = input) => {
    const question = value.trim();
    const targetChatId = activeChat?.id;
    if (!question || !targetChatId || pendingChats[targetChatId]) return;
    const pendingMessageId = crypto.randomUUID();
    setChats((items) => items.map((chat) => chat.id !== targetChatId ? chat : {
      ...chat,
      title: chat.messages.length ? chat.title : question.length > 40 ? `${question.slice(0, 40)}…` : question,
      updatedAt: Date.now(),
      messages: [...chat.messages, { role: "user", text: question }, { role: "assistant", loading: true, id: pendingMessageId }],
    }));
    setInput("");
    setPendingChats((current) => ({ ...current, [targetChatId]: true }));
    window.setTimeout(() => {
      setChats((items) => items.map((chat) => chat.id !== targetChatId ? chat : {
        ...chat,
        updatedAt: Date.now(),
        messages: chat.messages.map((message) => message.id === pendingMessageId ? { role: "assistant", text: answerFor(question) } : message),
      }));
      setPendingChats((current) => ({ ...current, [targetChatId]: false }));
    }, 5000);
  };

  const newChat = () => { const chat = makeChat(); setChats((items) => [chat, ...items]); setActiveId(chat.id); setInput(""); };
  const deleteChat = (id) => {
    const rest = chats.filter((chat) => chat.id !== id);
    const next = rest.length ? rest : [makeChat()];
    setChats(next);
    if (activeId === id) setActiveId(next[0].id);
  };

  return <main className="scenario-chat" style={{ marginLeft: leftMargin }}>
    <aside className="scenario-chat-history">
      <label className="scenario-chat-search"><Search size={17}/><input aria-label="Search chats" placeholder="Search chats..." value={search} onChange={(e) => setSearch(e.target.value)}/></label>
      <div className="scenario-chat-list">
        {[["Today", groupedChats.today], ["Previous chats", groupedChats.older]].map(([label, list]) => list.length > 0 && <section key={label}><div className="scenario-chat-group-label">{label}</div>{list.map((chat) => <div className={`scenario-chat-item ${chat.id === activeId ? "active" : ""}`} key={chat.id}><button onClick={() => setActiveId(chat.id)} title={chat.title}>{chat.title}</button><button className="scenario-chat-delete" aria-label={`Delete ${chat.title}`} onClick={() => deleteChat(chat.id)}><Trash2 size={14}/></button></div>)}</section>)}
        {!groupedChats.today.length && !groupedChats.older.length && <p className="scenario-chat-empty-search">No matching chats</p>}
      </div>
      <button className="scenario-chat-new" onClick={newChat}><MessageSquarePlus size={17}/> New Chat</button>
    </aside>

    <section className="scenario-chat-main">
      <header className="scenario-chat-top"><div className="scenario-chat-brand"><span><Sparkles size={16}/></span> AI Learning Assistant</div><button onClick={newChat}><MessageSquarePlus size={16}/> New chat</button></header>
      <div className="scenario-chat-thread" ref={scrollRef}>
        {activeChat?.messages.length ? (
          <div className="scenario-chat-messages">
            {activeChat.messages.map((message, index) => (
              <article key={`${activeChat.id}-${index}`} className={`scenario-chat-message ${message.role}`}>
                <div className="scenario-chat-avatar">{message.role === "assistant" ? <Bot size={18}/> : "You"}</div>
                <div className={`scenario-chat-bubble ${message.loading ? "scenario-chat-loader" : ""}`}>
                  {message.loading ? <LoaderText /> : message.text}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="scenario-chat-welcome">
            <div className="scenario-chat-orb"><Sparkles size={28}/></div>
            <p className="scenario-chat-eyebrow">Ask Karmayogi AI to get an personalized solution</p>
            <h1>What problems can I help you solve?</h1>
            <p className="scenario-chat-intro">Ask whatever makes you blossom.</p>
            <div className="scenario-chat-suggestions">
              {suggestedQuestions.map((prompt) => <button key={prompt} onClick={() => sendMessage(prompt)}>{prompt}<ArrowUp size={15}/></button>)}
            </div>
          </div>
        )}
      </div>
      <div className="scenario-chat-compose-wrap"><form className="scenario-chat-compose" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}><textarea rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Ask a technical or scenario-based question..." aria-label="Message the AI assistant"/><div className="scenario-chat-compose-footer"><button disabled={!input.trim() || pendingChats[activeChat?.id]} aria-label="Send message" type="submit"><Send size={17}/></button></div></form><p className="scenario-chat-note">Answers are generated from the assistant’s configured guidance. Validate production decisions against your environment.</p></div>
    </section>
  </main>;
}
