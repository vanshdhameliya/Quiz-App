package com.quizapp.config;

import com.quizapp.model.Question;
import com.quizapp.model.Quiz;
import com.quizapp.repository.QuizRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final QuizRepository quizRepository;

    public DataInitializer(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Override
    public void run(String... args) {
        if (quizRepository.count() > 0) {
            return;
        }

        Quiz springBoot = new Quiz("Spring Boot", "Core concepts every Spring Boot developer should know.");
        springBoot.addQuestion(new Question(
                "Which annotation is used to mark a class as a REST controller?",
                List.of("@RestController", "@Component", "@Service", "@Repository"), 0));
        springBoot.addQuestion(new Question(
                "What is the default embedded web server used by Spring Boot?",
                List.of("Jetty", "Tomcat", "Undertow", "Netty"), 1));
        springBoot.addQuestion(new Question(
                "Which single annotation is typically placed on the main class of a Spring Boot app?",
                List.of("@ComponentScan", "@Configuration", "@SpringBootApplication", "@EnableJpaRepositories"), 2));
        springBoot.addQuestion(new Question(
                "Which file is commonly used to configure a Spring Boot app's properties?",
                List.of("web.xml", "pom.xml", "application.properties", "build.gradle"), 2));
        springBoot.addQuestion(new Question(
                "Which annotation injects a bean dependency in Spring?",
                List.of("@Bean", "@Autowired", "@Configuration", "@Component"), 1));
        quizRepository.save(springBoot);

        Quiz cn = new Quiz("Computer Networks", "Fundamentals of networking, protocols, and the OSI model.");
        cn.addQuestion(new Question(
                "Which OSI layer is responsible for routing packets between networks?",
                List.of("Data Link", "Network", "Transport", "Application"), 1));
        cn.addQuestion(new Question(
                "What does DNS stand for?",
                List.of("Domain Name System", "Dynamic Network Service", "Data Node System", "Domain Node Service"), 0));
        cn.addQuestion(new Question(
                "Which transport-layer protocol is connection-oriented?",
                List.of("UDP", "IP", "TCP", "ICMP"), 2));
        cn.addQuestion(new Question(
                "What is the default port number for HTTPS?",
                List.of("80", "443", "8080", "21"), 1));
        cn.addQuestion(new Question(
                "Which device operates primarily at the Data Link layer?",
                List.of("Hub", "Switch", "Router", "Repeater"), 1));
        quizRepository.save(cn);

        Quiz os = new Quiz("Operating Systems", "Processes, scheduling, memory, and synchronization basics.");
        os.addQuestion(new Question(
                "Which of the following is NOT one of the four necessary conditions for deadlock?",
                List.of("Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"), 2));
        os.addQuestion(new Question(
                "Which memory management technique divides memory into fixed-size blocks?",
                List.of("Segmentation", "Paging", "Swapping", "Caching"), 1));
        os.addQuestion(new Question(
                "What primarily causes thrashing in an operating system?",
                List.of("Excessive page faults", "Too many CPU cores", "Disk fragmentation", "High network latency"), 0));
        os.addQuestion(new Question(
                "Which CPU scheduling algorithm gives the shortest average waiting time in theory?",
                List.of("First Come First Served", "Round Robin", "Shortest Job First", "Priority Scheduling"), 2));
        os.addQuestion(new Question(
                "What is the primary purpose of a semaphore in an operating system?",
                List.of("Process synchronization", "Memory allocation", "File compression", "Network routing"), 0));
        quizRepository.save(os);

        Quiz dbms = new Quiz("DBMS", "Relational database concepts, normalization, and SQL.");
        dbms.addQuestion(new Question(
                "Which normal form removes partial dependency on a composite key?",
                List.of("1NF", "2NF", "3NF", "BCNF"), 1));
        dbms.addQuestion(new Question(
                "What does the 'I' in the ACID properties of a transaction stand for?",
                List.of("Integrity", "Indexing", "Isolation", "Instance"), 2));
        dbms.addQuestion(new Question(
                "Which SQL command removes a table entirely, including its structure?",
                List.of("DELETE", "TRUNCATE", "DROP", "REMOVE"), 2));
        dbms.addQuestion(new Question(
                "Which type of join returns only the rows that match in both tables?",
                List.of("LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"), 2));
        dbms.addQuestion(new Question(
                "Which key uniquely identifies a record in a table and cannot be null?",
                List.of("Foreign Key", "Candidate Key", "Composite Key", "Primary Key"), 3));
        quizRepository.save(dbms);
    }
}
