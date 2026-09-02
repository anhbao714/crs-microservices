package vn.edu.crs.courseservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.crs.courseservice.dto.CourseRequest;
import vn.edu.crs.courseservice.dto.CourseResponse;
import vn.edu.crs.courseservice.entity.Course;
import vn.edu.crs.courseservice.repository.CourseRepository;

import java.util.NoSuchElementException;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + id));
        return toResponse(course);
    }

    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsByTenMonHocIgnoreCase(request.getTenMonHoc())) {
            throw new IllegalArgumentException("Ten mon hoc da ton tai");
        }

        Course course = new Course();
        course.setTenMonHoc(request.getTenMonHoc());
        course.setSoTinChi(request.getSoTinChi());
        course.setSoChoToiDa(request.getSoChoToiDa());
        // Quy tac nghiep vu: khi tao moi, so cho con lai luon bang so cho toi da
        course.setSoChoConLai(request.getSoChoToiDa());

        return toResponse(courseRepository.save(course));
    }

    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + id));

        course.setTenMonHoc(request.getTenMonHoc());
        course.setSoTinChi(request.getSoTinChi());
        course.setSoChoToiDa(request.getSoChoToiDa());
        // Khong cho sua truc tiep soChoConLai qua API update thong thuong

        return toResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new NoSuchElementException("Khong tim thay mon hoc id = " + id);
        }
        courseRepository.deleteById(id);
    }

    public Page<CourseResponse> search(String keyword, Pageable pageable) {
        System.out.println("  [Service] Using " + (keyword == null || keyword.isBlank() ? "findAll" : "findByKeyword") + " method");
        System.out.println("  [Service] Pageable: pageNumber=" + pageable.getPageNumber() + ", pageSize=" + pageable.getPageSize() + ", offset=" + pageable.getOffset());

        Page<Course> page = (keyword == null || keyword.isBlank())
                ? courseRepository.findAll(pageable)
                : courseRepository.findByTenMonHocContainingIgnoreCase(keyword, pageable);

        System.out.println("  [Service] DB returned: " + page.getContent().size() + " courses out of " + page.getTotalElements() + " total");
        System.out.println("  [Service] Course IDs: " + page.getContent().stream().map(c -> c.getId()).collect(java.util.stream.Collectors.toList()));

        return page.map(this::toResponse);
    }

    @Transactional
    public CourseResponse reserveSeat(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + id));
        if (course.getSoChoConLai() <= 0) {
            throw new IllegalStateException("Mon hoc da het cho, khong the dang ky");
        }
        course.setSoChoConLai(course.getSoChoConLai() - 1);
        return toResponse(courseRepository.save(course));
    }

    @Transactional
    public CourseResponse releaseSeat(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + id));
        if (course.getSoChoConLai() < course.getSoChoToiDa()) {
            course.setSoChoConLai(course.getSoChoConLai() + 1);
        }
        return toResponse(courseRepository.save(course));
    }

    private CourseResponse toResponse(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getTenMonHoc(),
                course.getSoTinChi(),
                course.getSoChoToiDa(),
                course.getSoChoConLai()
        );
    }
}
