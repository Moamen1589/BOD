import {
  type User, type InsertUser,
  type ContactMessage, type InsertContactMessage,
  type SiteSetting, type InsertSiteSetting,
  type Service, type InsertService,
  type Article, type InsertArticle,
  type WorkItem, type InsertWorkItem,
  type DigitalSolution, type InsertDigitalSolution,
  users, contactMessages, siteSettings, services, articles, workItems, digitalSolutions
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(msg: InsertContactMessage): Promise<ContactMessage>;
  markMessageRead(id: number): Promise<void>;
  deleteMessage(id: number): Promise<void>;
  getUnreadCount(): Promise<number>;

  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;

  getServices(): Promise<Service[]>;
  getPublishedServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;

  getWorkItems(): Promise<WorkItem[]>;
  getPublishedWorkItems(): Promise<WorkItem[]>;
  getWorkItemsByCategory(category: string): Promise<WorkItem[]>;
  getWorkItem(id: number): Promise<WorkItem | undefined>;
  getWorkItemBySlug(slug: string): Promise<WorkItem | undefined>;
  createWorkItem(item: InsertWorkItem): Promise<WorkItem>;
  updateWorkItem(id: number, item: Partial<InsertWorkItem>): Promise<WorkItem>;
  deleteWorkItem(id: number): Promise<void>;

  getDigitalSolutions(): Promise<DigitalSolution[]>;
  getPublishedDigitalSolutions(): Promise<DigitalSolution[]>;
  getDigitalSolutionsByType(type: string): Promise<DigitalSolution[]>;
  getDigitalSolution(id: number): Promise<DigitalSolution | undefined>;
  getDigitalSolutionBySlug(slug: string): Promise<DigitalSolution | undefined>;
  createDigitalSolution(solution: InsertDigitalSolution): Promise<DigitalSolution>;
  updateDigitalSolution(id: number, solution: Partial<InsertDigitalSolution>): Promise<DigitalSolution>;
  deleteDigitalSolution(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [msg] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return msg;
  }

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(msg).returning();
    return message;
  }

  async markMessageRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  async getUnreadCount(): Promise<number> {
    const msgs = await db.select().from(contactMessages).where(eq(contactMessages.isRead, false));
    return msgs.length;
  }

  async getSiteSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(setting.key);
    if (existing) {
      const [updated] = await db.update(siteSettings)
        .set({ value: setting.value })
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return updated;
    }
    const [created] = await db.insert(siteSettings).values(setting).returning();
    return created;
  }

  async getServices(): Promise<Service[]> {
    return db.select().from(services).orderBy(asc(services.sortOrder));
  }

  async getPublishedServices(): Promise<Service[]> {
    return db.select().from(services).where(eq(services.published, true)).orderBy(asc(services.sortOrder));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getArticles(): Promise<Article[]> {
    return db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getPublishedArticles(): Promise<Article[]> {
    return db.select().from(articles).where(eq(articles.published, true)).orderBy(desc(articles.createdAt));
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return db.select().from(articles)
      .where(and(eq(articles.category, category), eq(articles.published, true)))
      .orderBy(desc(articles.createdAt));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [created] = await db.insert(articles).values(article).returning();
    return created;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article> {
    const [updated] = await db.update(articles).set(article).where(eq(articles.id, id)).returning();
    return updated;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getWorkItems(): Promise<WorkItem[]> {
    return db.select().from(workItems).orderBy(desc(workItems.createdAt));
  }

  async getPublishedWorkItems(): Promise<WorkItem[]> {
    return db.select().from(workItems).where(eq(workItems.published, true)).orderBy(desc(workItems.createdAt));
  }

  async getWorkItemsByCategory(category: string): Promise<WorkItem[]> {
    return db.select().from(workItems)
      .where(and(eq(workItems.category, category), eq(workItems.published, true)))
      .orderBy(desc(workItems.createdAt));
  }

  async getWorkItem(id: number): Promise<WorkItem | undefined> {
    const [item] = await db.select().from(workItems).where(eq(workItems.id, id));
    return item;
  }

  async getWorkItemBySlug(slug: string): Promise<WorkItem | undefined> {
    const [item] = await db.select().from(workItems).where(eq(workItems.slug, slug));
    return item;
  }

  async createWorkItem(item: InsertWorkItem): Promise<WorkItem> {
    const [created] = await db.insert(workItems).values(item).returning();
    return created;
  }

  async updateWorkItem(id: number, item: Partial<InsertWorkItem>): Promise<WorkItem> {
    const [updated] = await db.update(workItems).set(item).where(eq(workItems.id, id)).returning();
    return updated;
  }

  async deleteWorkItem(id: number): Promise<void> {
    await db.delete(workItems).where(eq(workItems.id, id));
  }

  async getDigitalSolutions(): Promise<DigitalSolution[]> {
    return db.select().from(digitalSolutions).orderBy(desc(digitalSolutions.createdAt));
  }

  async getPublishedDigitalSolutions(): Promise<DigitalSolution[]> {
    return db.select().from(digitalSolutions).where(eq(digitalSolutions.published, true)).orderBy(desc(digitalSolutions.createdAt));
  }

  async getDigitalSolutionsByType(type: string): Promise<DigitalSolution[]> {
    return db.select().from(digitalSolutions)
      .where(and(eq(digitalSolutions.solutionType, type), eq(digitalSolutions.published, true)))
      .orderBy(desc(digitalSolutions.createdAt));
  }

  async getDigitalSolution(id: number): Promise<DigitalSolution | undefined> {
    const [solution] = await db.select().from(digitalSolutions).where(eq(digitalSolutions.id, id));
    return solution;
  }

  async getDigitalSolutionBySlug(slug: string): Promise<DigitalSolution | undefined> {
    const [solution] = await db.select().from(digitalSolutions).where(eq(digitalSolutions.slug, slug));
    return solution;
  }

  async createDigitalSolution(solution: InsertDigitalSolution): Promise<DigitalSolution> {
    const [created] = await db.insert(digitalSolutions).values(solution).returning();
    return created;
  }

  async updateDigitalSolution(id: number, solution: Partial<InsertDigitalSolution>): Promise<DigitalSolution> {
    const [updated] = await db.update(digitalSolutions).set(solution).where(eq(digitalSolutions.id, id)).returning();
    return updated;
  }

  async deleteDigitalSolution(id: number): Promise<void> {
    await db.delete(digitalSolutions).where(eq(digitalSolutions.id, id));
  }
}

export const storage = new DatabaseStorage();
