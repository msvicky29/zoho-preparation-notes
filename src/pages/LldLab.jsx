import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './LldLab.css'


const QUESTIONS = [
  {
    id: 'snake-and-ladder',
    navTitle: 'Snake and Ladder',
    difficulty: 'medium',
    tags: ['OOP Design', 'Simulation'],
    title: 'Design Snake and Ladder',
    desc: 'Design a multiplayer Snake and Ladder game with a configurable board, dice, players, snakes and ladders — commonly asked at Flipkart, Swiggy, and Ola for SDE-1/2 machine coding rounds.',
    requirements: [
      { label: 'Board', text: 'Configurable size (default 100 cells) with a set of snakes and ladders placed at specific positions.' },
      { label: 'Dice', text: 'A single 6-faced dice; support for multiple dice as an extension.' },
      { label: 'Players', text: '2–4 players take turns rolling the dice and moving their piece.' },
      { label: 'Snakes/Ladders', text: "Landing on a snake's head moves the player down to its tail; landing on a ladder's base moves the player up to its top." },
      { label: 'Win condition', text: 'First player to reach exactly the last cell wins. Overshoot moves are ignored (player stays in place).' },
      { label: 'Extensibility', text: 'Should support adding new dice types or board sizes without changing core game logic (Open/Closed Principle).' },
    ],
    files: [
      {
        id: 'Board',
        name: 'Board.java',
        code: `public class Board {
    private final int size;
    private final Map<Integer, Integer> snakesAndLadders = new HashMap<>();

    public Board(int size) {
        this.size = size;
    }

    public void addSnake(int head, int tail) {
        if (head <= tail) throw new IllegalArgumentException("Snake head must be above tail");
        snakesAndLadders.put(head, tail);
    }

    public void addLadder(int base, int top) {
        if (base >= top) throw new IllegalArgumentException("Ladder base must be below top");
        snakesAndLadders.put(base, top);
    }

    public int getFinalPosition(int position) {
        return snakesAndLadders.getOrDefault(position, position);
    }

    public int getSize() {
        return size;
    }
}`,
      },
      {
        id: 'Dice',
        name: 'Dice.java',
        code: `import java.util.Random;

public class Dice {
    private final int faces;
    private final Random random = new Random();

    public Dice(int faces) {
        this.faces = faces;
    }

    public int roll() {
        return random.nextInt(faces) + 1;
    }
}`,
      },
      {
        id: 'Player',
        name: 'Player.java',
        code: `public class Player {
    private final String name;
    private int position;

    public Player(String name) {
        this.name = name;
        this.position = 0;
    }

    public String getName() { return name; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}`,
      },
      {
        id: 'Game',
        name: 'Game.java',
        code: `import java.util.*;

public class Game {
    private final Board board;
    private final Dice dice;
    private final Queue<Player> players = new LinkedList<>();

    public Game(Board board, Dice dice, List<Player> playerList) {
        this.board = board;
        this.dice = dice;
        this.players.addAll(playerList);
    }

    public void play() {
        while (players.size() > 1) {
            Player current = players.poll();
            int roll = dice.roll();
            int newPos = current.getPosition() + roll;

            if (newPos > board.getSize()) {
                System.out.println(current.getName() + " rolled " + roll + " — overshoot, stays at " + current.getPosition());
                players.add(current);
                continue;
            }

            newPos = board.getFinalPosition(newPos);
            current.setPosition(newPos);
            System.out.println(current.getName() + " rolled " + roll + " -> moved to " + newPos);

            if (newPos == board.getSize()) {
                System.out.println(current.getName() + " WINS!");
                return;
            }
            players.add(current);
        }
    }

    public static void main(String[] args) {
        Board board = new Board(100);
        board.addSnake(99, 21);
        board.addLadder(4, 56);

        List<Player> players = List.of(new Player("Vignesh"), new Player("Arun"));
        Game game = new Game(board, new Dice(6), players);
        game.play();
    }
}`,
      },
    ],
    output: `javac Game.java && java Game

Vignesh rolled 4 -> moved to 56
Arun rolled 2 -> moved to 2
Vignesh rolled 5 -> moved to 61
Arun rolled 6 -> moved to 8
...
Vignesh rolled 3 -> moved to 100
Vignesh WINS!`,
  },
  {
    id: 'car-rental-service',
    navTitle: 'Car Rental',
    difficulty: 'hard',
    tags: ['Strategy Pattern', 'Booking System'],
    title: 'Design a Car Rental Service',
    desc: 'Design a system like Zoomcar/Avis that lets users search available vehicles, book them for a date range, and calculates rent using pluggable pricing strategies.',
    requirements: [
      { label: 'Vehicles', text: 'Multiple types (Hatchback, SUV, Sedan) each with its own hourly/daily rate.' },
      { label: 'Search', text: 'Users can search available vehicles by type and date range.' },
      { label: 'Booking', text: 'A vehicle can only be booked by one user for a given date range (no overlapping bookings).' },
      { label: 'Pricing', text: 'Rent = base rate × duration, with support for pluggable strategies (e.g. weekend surcharge, long-duration discount).' },
      { label: 'Cancellation', text: 'Users can cancel a booking before the rental starts.' },
      { label: 'Extensibility', text: 'New vehicle types or pricing strategies should be addable without modifying existing booking logic.' },
    ],
    files: [
      {
        id: 'Vehicle',
        name: 'Vehicle.java',
        code: `public class Vehicle {
    private final String id;
    private final String type;      // "HATCHBACK", "SUV", "SEDAN"
    private final double dailyRate;
    private boolean isAvailable;

    public Vehicle(String id, String type, double dailyRate) {
        this.id = id;
        this.type = type;
        this.dailyRate = dailyRate;
        this.isAvailable = true;
    }

    public String getId() { return id; }
    public String getType() { return type; }
    public double getDailyRate() { return dailyRate; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
}`,
      },
      {
        id: 'Pricing',
        name: 'PricingStrategy.java',
        code: `public interface PricingStrategy {
    double calculate(Vehicle vehicle, int days);
}

class DefaultPricing implements PricingStrategy {
    public double calculate(Vehicle vehicle, int days) {
        return vehicle.getDailyRate() * days;
    }
}

class WeekendSurchargePricing implements PricingStrategy {
    public double calculate(Vehicle vehicle, int days) {
        double base = vehicle.getDailyRate() * days;
        return base + (base * 0.15); // 15% weekend surcharge
    }
}

class LongDurationDiscountPricing implements PricingStrategy {
    public double calculate(Vehicle vehicle, int days) {
        double base = vehicle.getDailyRate() * days;
        if (days >= 7) return base - (base * 0.10); // 10% off for 7+ days
        return base;
    }
}`,
      },
      {
        id: 'Booking',
        name: 'Booking.java',
        code: `import java.time.LocalDate;
import java.util.UUID;

public class Booking {
    private final String bookingId;
    private final Vehicle vehicle;
    private final String userId;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final double totalCost;

    public Booking(Vehicle vehicle, String userId, LocalDate startDate, LocalDate endDate, double totalCost) {
        this.bookingId = UUID.randomUUID().toString();
        this.vehicle = vehicle;
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalCost = totalCost;
    }

    public String getBookingId() { return bookingId; }
    public Vehicle getVehicle() { return vehicle; }
    public double getTotalCost() { return totalCost; }
}`,
      },
      {
        id: 'Service',
        name: 'RentalService.java',
        code: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class RentalService {
    private final List<Vehicle> vehicles = new ArrayList<>();
    private final Map<String, Booking> bookings = new HashMap<>();
    private final PricingStrategy pricingStrategy;

    public RentalService(PricingStrategy pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    public void addVehicle(Vehicle v) { vehicles.add(v); }

    public List<Vehicle> searchAvailable(String type) {
        List<Vehicle> result = new ArrayList<>();
        for (Vehicle v : vehicles) {
            if (v.getType().equals(type) && v.isAvailable()) result.add(v);
        }
        return result;
    }

    public Booking bookVehicle(Vehicle vehicle, String userId, LocalDate start, LocalDate end) {
        if (!vehicle.isAvailable()) throw new IllegalStateException("Vehicle not available");
        int days = (int) ChronoUnit.DAYS.between(start, end);
        double cost = pricingStrategy.calculate(vehicle, Math.max(days, 1));

        vehicle.setAvailable(false);
        Booking booking = new Booking(vehicle, userId, start, end, cost);
        bookings.put(booking.getBookingId(), booking);
        return booking;
    }

    public void cancelBooking(String bookingId) {
        Booking b = bookings.remove(bookingId);
        if (b != null) b.getVehicle().setAvailable(true);
    }

    public static void main(String[] args) {
        RentalService service = new RentalService(new WeekendSurchargePricing());
        service.addVehicle(new Vehicle("V1", "SUV", 2500));

        List<Vehicle> available = service.searchAvailable("SUV");
        Booking booking = service.bookVehicle(available.get(0), "user_101",
                LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 3));

        System.out.println("Booked: " + booking.getVehicle().getId() + " | Total: Rs." + booking.getTotalCost());
    }
}`,
      },
    ],
    output: `javac RentalService.java && java RentalService

Booked: V1 | Total: Rs.5750.0`,
  },
]


const JAVA_KEYWORDS = new Set([
  'public', 'private', 'protected', 'class', 'interface', 'implements',
  'extends', 'return', 'if', 'else', 'while', 'for', 'new', 'this',
  'static', 'final', 'void', 'import', 'package', 'throw', 'throws',
  'try', 'catch', 'finally', 'true', 'false', 'null', 'instanceof',
  'int', 'double', 'boolean', 'char', 'long', 'float', 'byte', 'short',
])

function highlightJava(code) {
  const parts = []
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|(\b\d+(?:\.\d+)?\b)|(\b[A-Z][A-Za-z0-9_]*\b)|(\b[a-z][A-Za-z0-9_]*\b)|([^A-Za-z0-9_"/\s]+)|(\s+)/g

  let match
  while ((match = re.exec(code)) !== null) {
    const [full, comment, str, num, typeish, word, punct, space] = match
    if (comment) {
      parts.push(<span key={parts.length} className="lld-tok-cm">{comment}</span>)
    } else if (str) {
      parts.push(<span key={parts.length} className="lld-tok-str">{str}</span>)
    } else if (num) {
      parts.push(<span key={parts.length} className="lld-tok-num">{num}</span>)
    } else if (typeish) {
      parts.push(<span key={parts.length} className="lld-tok-type">{typeish}</span>)
    } else if (word) {
      if (JAVA_KEYWORDS.has(word)) {
        parts.push(<span key={parts.length} className="lld-tok-kw">{word}</span>)
      } else {
        parts.push(word)
      }
    } else if (punct) {
      parts.push(punct)
    } else if (space) {
      parts.push(space)
    } else {
      parts.push(full)
    }
  }
  return parts
}

function QuestionView({ question }) {
  const [activeFile, setActiveFile] = useState(question.files[0].id)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setActiveFile(question.files[0].id)
    setCopied(false)
  }, [question])

  const active = question.files.find((f) => f.id === activeFile) ?? question.files[0]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <article className="lld-content">
      <div className="lld-content__meta">
        <span className={`lld-badge lld-badge--${question.difficulty}`}>
          {question.difficulty.toUpperCase()}
        </span>
        {question.tags.map((tag) => (
          <span key={tag} className="lld-badge lld-badge--tag">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="lld-content__title">{question.title}</h1>

      <section className="lld-content__question" aria-label="Problem statement">
        <h2 className="lld-content__section-label">Problem</h2>
        <p className="lld-content__desc">{question.desc}</p>
        <ul className="lld-content__req">
          {question.requirements.map((req) => (
            <li key={req.label}>
              <b>{req.label}:</b> {req.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="lld-content__code" aria-label="Solution code">
        <div className="lld-content__section-row">
          <h2 className="lld-content__section-label">Solution</h2>
          <button
            type="button"
            className={`lld-copy${copied ? ' lld-copy--copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="lld-editor">
          <div className="lld-tabbar" role="tablist" aria-label="Source files">
            {question.files.map((file) => (
              <button
                key={file.id}
                type="button"
                role="tab"
                aria-selected={file.id === activeFile}
                className={`lld-tab${file.id === activeFile ? ' lld-tab--active' : ''}`}
                onClick={() => setActiveFile(file.id)}
              >
                {file.name}
              </button>
            ))}
          </div>

          {question.files.map((file) => (
            <div
              key={file.id}
              className={`lld-code-panel${file.id === activeFile ? ' lld-code-panel--active' : ''}`}
              role="tabpanel"
              hidden={file.id !== activeFile}
            >
              <pre>
                <code>{highlightJava(file.code)}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="lld-content__output" aria-label="Sample output">
        <h2 className="lld-content__section-label">Sample Output</h2>
        <div className="lld-output">
          <pre>
            <span className="lld-output__arrow">$ </span>
            {question.output}
          </pre>
        </div>
      </section>
    </article>
  )
}

export default function LldLab() {
  const [searchParams] = useSearchParams()
  const requestedId = searchParams.get('q')
  const active =
    QUESTIONS.find((q) => q.id === requestedId) ?? QUESTIONS[0]

  return (
    <div className="lld-lab">
      <div className="lld-main">
        <QuestionView key={active.id} question={active} />
      </div>
    </div>
  )
}
